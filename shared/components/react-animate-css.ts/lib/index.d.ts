import * as React from 'react';
export interface AnimateProps {
    animationEnter: string;
    animationLeave: string;
    durationEnter: number;
    durationLeave: number;
    className?: string;
    key?: number | string;
    component?: string;
}
declare class Animate extends React.Component<AnimateProps, {}> {
    static propTypes: {
        animationEnter: React.Validator<any>;
        animationLeave: React.Validator<any>;
        durationEnter: React.Validator<any>;
        durationLeave: React.Validator<any>;
    };
    renderStyle: (animationEnter: string, animationLeave: string, durationEnter: number, durationLeave: number) => string;
    render(): JSX.Element;
}
export default Animate;
