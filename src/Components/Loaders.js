import * as React from "react";
import * as SVG from "../Common/SVG";

const LoaderSpinner = (props) => (
	<>
		<span className="loaderSpinner">
			<SVG.Loader className="loaderSpinnerSVG" style={{ width: '16px', height: '16px', color: '#0084FF' }} />
		</span>
	</>
);

export default LoaderSpinner;