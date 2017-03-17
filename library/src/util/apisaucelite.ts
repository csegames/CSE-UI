/**
 * TypeScript conversion with addtion of call method
 * based on apisauce https://github.com/skellock/apisauce
 *
 * apisauce is licensed by the MIT license:
 *  Copyright (c) <year> <copyright holders>
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *  and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, Promise} from 'axios'
import {findIndex} from './arrayUtils';
import {CSEError} from '../webAPI/apierrors';

// the default headers given to axios
export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

// the default configuration for axios, default headers will also be merged in
const DEFAULT_CONFIG = {
  timeout: 0
}

export const NONE: any = null
export const CLIENT_ERROR = 'CLIENT_ERROR'
export const SERVER_ERROR = 'SERVER_ERROR'
export const TIMEOUT_ERROR = 'TIMEOUT_ERROR'
export const CONNECTION_ERROR = 'CONNECTION_ERROR'
export const NETWORK_ERROR = 'NETWORK_ERROR'
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR'

const TIMEOUT_ERROR_CODES = ['ECONNABORTED']
const NODEJS_CONNECTION_ERROR_CODES = ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET']
const in200s = (n: number) => n >= 200 && n <= 299;
const in400s = (n: number) => n >= 400 && n <= 499;
const in500s = (n: number) => n >= 500 && n <= 599;

export interface CreateOptions {
  baseURL: string;
  headers?: Headers;
  timeout?: number;
}

export interface Headers {
  [id: string]: string;
}

export interface QueryStringParams {
  [id: string]: any;
}

/**
  Creates a instance of our API using the configuration.
 */
export const create = (config: CreateOptions) => {
  // combine the user's defaults with ours
  const headers = Object.assign({}, DEFAULT_HEADERS, config.headers || {});
  const combinedConfig = Object.assign({}, DEFAULT_CONFIG, config);
  config.headers = null;

  // create the axios instance
  const instance = axios.create(combinedConfig)

  const monitors: any[] = []
  const addMonitor = (monitor: any) => {
    monitors.push(monitor)
  }

  // convenience for setting new request headers
  const setHeader = (name: string, value: string) => {
    headers[name] = value
    return instance
  }

  // sets headers in bulk
  const setHeaders = (headers: Headers) => {
    for (var key in headers) {
      setHeader(key, headers[key])
    }
    return instance
  }

  /**
    Make the request for GET, HEAD, DELETE
   */
  const doRequestWithoutBody = (method: string, url: string, params: any = {}, axiosConfig: AxiosRequestConfig = {}) => {
    return doRequest(Object.assign({}, {url, params, method}, axiosConfig))
  }

  /**
    Make the request for POST, PUT, PATCH
   */
  const doRequestWithBody = (method: string, url: string, data: any = null, axiosConfig: AxiosRequestConfig = {}) => {
    return doRequest(Object.assign({}, { url, method, data }, axiosConfig))
  }

  /**
    Make the request with this config!
   */
  const doRequest = function(axiosRequestConfig: AxiosRequestConfig) {
    const startedAt = new Date().valueOf();

    axiosRequestConfig.headers = Object.assign({}, headers, axiosRequestConfig.headers);

    // Make the request and execute the identical pipeline for both promise paths.
    return instance
      .request(axiosRequestConfig)
      .then((response: AxiosResponse) => convertResponse(startedAt, response))
      .catch((error: AxiosError) => convertResponse(startedAt, error))
  }

  const parseError = (error: AxiosError) : CSEError => {
    const stack = error.stack
    let err

    // try and json parse the response, if successful, assume its
    // the newer response type
    if (error.response.headers['content-type'] == 'text/json') {
      err = error.response.data;
    } else {
      // old style error response, map to new style
      err = {
        Code: error.code || error.response.status,
        Message: error.response.data || error.message
      }
    }

    // extract basic error name from status
    // err.Name = getProblemFromStatus(error.response.status)()
    return err
  }

  /**
    Converts an axios response/error into our response.
   */
  const convertResponse = (startedAt: number, axiosResponse: AxiosResponse | AxiosError) => {
    const end = new Date().valueOf();
    const duration = (end - startedAt)

    // new in Axios 0.13 -- some data could be buried 1 level now
    const error = axiosResponse instanceof Error && parseError(axiosResponse)
    const response: AxiosResponse = error ? (axiosResponse as AxiosError).response : axiosResponse as AxiosResponse
    const status = response && response.status || null
    const problem = error ? getProblemFromError(axiosResponse as AxiosError) : getProblemFromStatus(status)
    const ok = in200s(status)
    const config = axiosResponse.config || null
    const headers = response && response.headers || null
    const data = response && response.data || null

    // give an opportunity for anything to the response transforms to change stuff along the way
    return { duration, problem, ok, status, headers, config, data, error }
  }

  /**
   * What's the problem for this response?
   *
   * TODO: We're losing some error granularity, but i'm cool with that
   * until someone cares.
   */
  const getProblemFromError = function(error: AxiosError): any {
    // first check if the error message is Network Error (set by axios at 0.12) on platforms other than NodeJS.
    if (error.message === 'Network Error') return () => NETWORK_ERROR;
    // then check the specific error code
    if (typeof error.code === 'undefined' || error.code == null) {
      return () => getProblemFromStatus(error.response.status);
    }

    if (findIndex(TIMEOUT_ERROR_CODES, error.code) >= 0) {
      return () => TIMEOUT_ERROR;
    }

    if (findIndex(NODEJS_CONNECTION_ERROR_CODES, error.code) >= 0) {
      return () => CONNECTION_ERROR;
    }

    return () => UNKNOWN_ERROR;
  }

  /**
   * Given a HTTP status code, return back the appropriate problem enum.
   */
  const getProblemFromStatus = (status: number) => {
    if (typeof status === 'undefined' || status == null) {
      return () => UNKNOWN_ERROR;
    }

    if (in200s(status)) {
      return () => NONE;
    }

    if (in400s(status)) {
      return () => CLIENT_ERROR;
    }

    if (in500s(status)) {
      return () => SERVER_ERROR;
    }

    return () => UNKNOWN_ERROR;
  }

  // create the base object
  const sauce = {
    axiosInstance: instance,
    setHeader,
    setHeaders,
    headers,
    get: (url: string, params: QueryStringParams = {}, axiosConfig: AxiosRequestConfig = {}) => doRequestWithoutBody('get', url, params, axiosConfig),
    post: (method: string, url: string, data: any = null, axiosConfig: AxiosRequestConfig = {}) => doRequestWithBody('post', url, data, axiosConfig),
    call: (url: string, params: QueryStringParams = {}, axiosConfig: AxiosRequestConfig = {}) => doRequestWithoutBody('post', url, params, axiosConfig),
  }
  // send back the sauce
  return sauce
}

export default {
  DEFAULT_HEADERS,
  NONE,
  CLIENT_ERROR,
  SERVER_ERROR,
  TIMEOUT_ERROR,
  CONNECTION_ERROR,
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  create
}
