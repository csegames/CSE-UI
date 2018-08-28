module.exports = {
  parser: "babel-eslint",
  rules: {
    "graphql/template-strings": ['error', {
      // env: 'apollo',
      schemaJson: require('./src/gql/schema.json'),
      validators: [
        // 'ExecutableDefinitions',
        'FieldsOnCorrectType',
        'FragmentsOnCompositeTypes',
        'KnownArgumentNames',
        'KnownDirectives', // (disabled by default in relay)
        // 'KnownFragmentNames', // disabled
        'KnownTypeNames',
        'LoneAnonymousOperation',
        'NoFragmentCycles',
        'NoUndefinedVariables', // (disabled by default in relay)
        // 'NoUnusedFragments', // disabled
        'NoUnusedVariables',
        // 'OverlappingFieldsCanBeMerged', // there are a handful of problems due to this
        'PossibleFragmentSpreads',
        // 'ProvidedNonNullArguments', // not working
        'ScalarLeafs', // (disabled by default in relay)
        'SingleFieldSubscriptions',
        'UniqueArgumentNames',
        'UniqueDirectivesPerLocation',
        'UniqueFragmentNames',
        'UniqueInputFieldNames',
        'UniqueOperationNames',
        'UniqueVariableNames',
        // 'ValuesOfCorrectType', // not working
        'VariablesAreInputTypes',
        // 'VariablesDefaultValueAllowed', // not working
        'VariablesInAllowedPosition',
      ]
    }]
  },
  plugins: [
    'graphql'
  ]
}
