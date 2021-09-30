import * as React from "react";
import * as SVG from "../Common/SVG";

const LoaderSpinner = (props) => (
	<>
		<span className="loaderSpinner">
			<SVG.Loader width="16px" height="16px" style={{ color: '#0084FF', display: 'block', margin: 'auto' }} />
		</span>
	</>
);

export default LoaderSpinner;