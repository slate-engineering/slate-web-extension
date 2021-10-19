import * as React from "react";
import * as SVG from "../Common/SVG";


export const LoadingSpinner = (props) => (
	<div className={props.loader && `svgcontainer`}>
		<span className={props.loader ? `loaderSpinnerSmall` : `loaderSpinnerLarge`}>
			<SVG.Loader width="16px" height="16px" style={{ color: '#0084FF', display: 'block', margin: 'auto' }} />
		</span>
	</div>
);


export const ToastSpinner = (props) => (
	<>
		<span className="loaderSpinner">
			<SVG.Loader width="16px" height="16px" style={{ color: '#0084FF', display: 'block', margin: 'auto' }} />
		</span>
	</>
);	