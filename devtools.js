//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Create tab and listener
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
chrome
	.devtools
	.panels
	.elements
	.createSidebarPane(
		"GEL",
		function(sidebar) {

			function updateElementProperties() {
				sidebar.setExpression('(' + GetProperties.toString() + ')()', 'Colors');
			}

			updateElementProperties();

			chrome
				.devtools
				.panels
				.elements
				.onSelectionChanged
				.addListener( updateElementProperties );
		}
	);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// get css properties from selected element
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
var GetProperties = function() {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// defaults
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	var DEBUG = false;

	var RELCSS = '*color*' + //relevant css properties
		'*background-color*' +
		'*border-left-color*' +
		'*border-bottom-color*' +
		'*border-right-color*' +
		'*border-top-color*' +
		'*outline-color*' +
		'*background*'

	var COLORS = getColors(); //color to GEL variable map

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// convert rgb/rgba to hex
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function Rgb2Hex( rgb ) {
		var output = '';

		if( rgb !== undefined && rgb !== 'initial' && rgb !== 'inherit' && rgb !== 'transparent' && rgb !== '' ) {
			rgb = rgb.toLowerCase();

			if( rgb.search('rgba') == -1 ) {
				rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

				function hex(x) {
					output = ('0' + parseInt(x).toString(16)).slice(-2);
				}
				output = '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			}
			else {
				rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
				function hex(x) {
					return ('0' + parseInt(x).toString(16)).slice(-2);
				}
				return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			}

		}
		else {
			return rgb;
		}

		return output;
	}

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// convert hex color to variable
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function getGELColor( color ) {
		var BOMVariable = COLORS['BOM'][ color ] ? 'BOM: ' + COLORS['BOM'][ color ] : '';
		var BSAVariable = COLORS['BSA'][ color ] ? 'BSA: ' + COLORS['BSA'][ color ] : '';
		var STGVariable = COLORS['STG'][ color ] ? 'STG: ' + COLORS['STG'][ color ] : '';
		var WBCVariable = COLORS['WBC'][ color ] ? 'WBC: ' + COLORS['WBC'][ color ] : '';

		var output = BOMVariable + BSAVariable + STGVariable + WBCVariable;

		if(output !== '') {
			output = '  |  VARIABLE = ' + output;
		}

		return output;
	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// iterare through all properties and filter the relevant
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function GetRelevantRules( style ) {
		var ticked = '**';
		var output = { __proto__: null };
		var style = style ? style : [];

		if(DEBUG && style) console.log('%cRule-sets: ' + style.length, 'font-size:20px;');

		for(var i = 0; i < style.length; i++) {

			for(var s = style[i].style.length - 1; s >= 0; s--) {
				var searchString = '*' + style[i].style[s] + '*';

				if( RELCSS.indexOf(searchString) !== -1 && ticked.indexOf(searchString) === -1 ) { //found in relevant properties and not duplicate
					ticked += searchString; //mark as found

					if(DEBUG) console.log( '%cfound: ' + style[i].style[s] + ' = ' + style[i].style[ style[i].style[s] ] +
						' | rule-set: ' + i, 'color:green;font-weight:900;');

					var property = style[i].style[s];
					var value = style[i].style[ style[i].style[s] ];
					var color = Rgb2Hex(value);

					output[ property ] = color + getGELColor( color );
				}
				else {
					if(DEBUG) console.log('%cskipped: ' + style[i].style[s], 'color:grey;');
				}
			};

		};

		if(DEBUG) console.log(output);

		return output;
	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// get selected element and run through functions
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	var output = GetRelevantRules( window.getMatchedCSSRules($0) );

	return output;


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// get selected element and run through functions
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function getColors() {
		return {
			"BOM": {
				"#d60c8c": "color-A",
				"#685ac0": "color-B",
				"#716f7d": "color-C",
				"#11b6af": "color-D",
				"#0d0d0d": "color-E",
				"#20024e": "color-F",
				"#403489": "color-G",
				"#a094fc": "color-H",
				"#00ff00": "success-color",
				"#c40000": "danger-color",
				"#d06800": "warning-color",
				"#0074c4": "info-color",
				"#da2498": "color-A-90",
				"#de3da3": "color-A-80",
				"#e255af": "color-A-70",
				"#e66dba": "color-A-60",
				"#eb86c6": "color-A-50",
				"#ef9ed1": "color-A-40",
				"#f3b6dd": "color-A-30",
				"#f7cee8": "color-A-20",
				"#fbe7f4": "color-A-10",
				"#fdf3f9": "color-A-5",
				"#776bc6": "color-B-90",
				"#867bcd": "color-B-80",
				"#958cd3": "color-B-70",
				"#a49cd9": "color-B-60",
				"#b4ade0": "color-B-50",
				"#c3bde6": "color-B-40",
				"#d2ceec": "color-B-30",
				"#e1def2": "color-B-20",
				"#f0eff9": "color-B-10",
				"#f7f7fc": "color-B-5",
				"#7f7d8a": "color-C-90",
				"#8d8c97": "color-C-80",
				"#9c9aa4": "color-C-70",
				"#aaa9b1": "color-C-60",
				"#b8b7be": "color-C-50",
				"#c6c5cb": "color-C-40",
				"#d4d4d8": "color-C-30",
				"#e3e2e5": "color-C-20",
				"#f1f1f2": "color-C-10",
				"#f8f8f9": "color-C-5",
				"#29bdb7": "color-D-90",
				"#41c5bf": "color-D-80",
				"#58ccc7": "color-D-70",
				"#70d3cf": "color-D-60",
				"#88dbd7": "color-D-50",
				"#a0e2df": "color-D-40",
				"#b8e9e7": "color-D-30",
				"#cff0ef": "color-D-20",
				"#e7f8f7": "color-D-10",
				"#f3fbfb": "color-D-5",
				"#361b60": "color-F-90",
				"#4d3571": "color-F-80",
				"#634e83": "color-F-70",
				"#796795": "color-F-60",
				"#9081a7": "color-F-50",
				"#a69ab8": "color-F-40",
				"#bcb3ca": "color-F-30",
				"#d2ccdc": "color-F-20",
				"#e9e6ed": "color-F-10",
				"#f4f2f6": "color-F-5",
				"#534895": "color-G-90",
				"#665da1": "color-G-80",
				"#7971ac": "color-G-70",
				"#8c85b8": "color-G-60",
				"#a09ac4": "color-G-50",
				"#b3aed0": "color-G-40",
				"#c6c2dc": "color-G-30",
				"#d9d6e7": "color-G-20",
				"#ecebf3": "color-G-10",
				"#f5f5f9": "color-G-5",
				"#aa9ffc": "color-H-90",
				"#b3a9fd": "color-H-80",
				"#bdb4fd": "color-H-70",
				"#c6bffd": "color-H-60",
				"#d0cafe": "color-H-50",
				"#d9d4fe": "color-H-40",
				"#e3dffe": "color-H-30",
				"#eceafe": "color-H-20",
				"#f6f4ff": "color-H-10",
				"#fafaff": "color-H-5",
				"#7f7d8a": "color-Gray-90",
				"#8d8c97": "color-Gray-80",
				"#9c9aa4": "color-Gray-70",
				"#aaa9b1": "color-Gray-60",
				"#b8b7be": "color-Gray-50",
				"#c6c5cb": "color-Gray-40",
				"#d4d4d8": "color-Gray-30",
				"#e3e2e5": "color-Gray-20",
				"#f1f1f2": "color-Gray-10",
				"#f8f8f9": "color-Gray-5",
				"#198d19": "success-color-90",
				"#339933": "success-color-80",
				"#4da64d": "success-color-70",
				"#66b366": "success-color-60",
				"#80c080": "success-color-50",
				"#99cc99": "success-color-40",
				"#b3d9b3": "success-color-30",
				"#cce6cc": "success-color-20",
				"#e6f2e6": "success-color-10",
				"#f2f9f2": "success-color-5",
				"#ca1919": "danger-color-90",
				"#d03333": "danger-color-80",
				"#d64d4d": "danger-color-70",
				"#dc6666": "danger-color-60",
				"#e28080": "danger-color-50",
				"#e79999": "danger-color-40",
				"#edb3b3": "danger-color-30",
				"#f3cccc": "danger-color-20",
				"#f9e6e6": "danger-color-10",
				"#fcf2f2": "danger-color-5",
				"#d57719": "warning-color-90",
				"#d98633": "warning-color-80",
				"#de954d": "warning-color-70",
				"#e3a466": "warning-color-60",
				"#e8b480": "warning-color-50",
				"#ecc399": "warning-color-40",
				"#f1d2b3": "warning-color-30",
				"#f6e1cc": "warning-color-20",
				"#faf0e6": "warning-color-10",
				"#fdf7f2": "warning-color-5",
				"#1982ca": "info-color-90",
				"#3390d0": "info-color-80",
				"#4d9ed6": "info-color-70",
				"#66acdc": "info-color-60",
				"#80bae2": "info-color-50",
				"#99c7e7": "info-color-40",
				"#b3d5ed": "info-color-30",
				"#cce3f3": "info-color-20",
				"#e6f1f9": "info-color-10",
				"#f2f8fc": "info-color-5"
			},
			"BSA": {
				"#c0142e": "color-A",
				"#365fb4": "color-B",
				"#333333": "color-C",
				"#36528a": "color-D",
				"#00ff00": "success-color",
				"#c40000": "danger-color",
				"#d06800": "warning-color",
				"#0074c4": "info-color",
				"#c62b43": "color-A-90",
				"#cd4358": "color-A-80",
				"#d35b6d": "color-A-70",
				"#d97282": "color-A-60",
				"#e08a97": "color-A-50",
				"#e6a1ab": "color-A-40",
				"#ecb9c0": "color-A-30",
				"#f2d0d5": "color-A-20",
				"#f9e8ea": "color-A-10",
				"#fcf3f5": "color-A-5",
				"#4a6fbc": "color-B-90",
				"#5e7fc3": "color-B-80",
				"#728fcb": "color-B-70",
				"#869fd2": "color-B-60",
				"#9bafda": "color-B-50",
				"#afbfe1": "color-B-40",
				"#c3cfe9": "color-B-30",
				"#d7dff0": "color-B-20",
				"#ebeff8": "color-B-10",
				"#f5f7fb": "color-B-5",
				"#474747": "color-C-90",
				"#5c5c5c": "color-C-80",
				"#707070": "color-C-70",
				"#858585": "color-C-60",
				"#999999": "color-C-50",
				"#adadad": "color-C-40",
				"#c2c2c2": "color-C-30",
				"#d6d6d6": "color-C-20",
				"#ebebeb": "color-C-10",
				"#f5f5f5": "color-C-5",
				"#4a6396": "color-D-90",
				"#5e75a1": "color-D-80",
				"#7286ad": "color-D-70",
				"#8697b9": "color-D-60",
				"#9ba9c5": "color-D-50",
				"#afbad0": "color-D-40",
				"#c3cbdc": "color-D-30",
				"#d7dce8": "color-D-20",
				"#ebeef3": "color-D-10",
				"#f5f6f9": "color-D-5",
				"#474747": "color-Gray-90",
				"#5c5c5c": "color-Gray-80",
				"#707070": "color-Gray-70",
				"#858585": "color-Gray-60",
				"#999999": "color-Gray-50",
				"#adadad": "color-Gray-40",
				"#c2c2c2": "color-Gray-30",
				"#d6d6d6": "color-Gray-20",
				"#ebebeb": "color-Gray-10",
				"#f5f5f5": "color-Gray-5",
				"#198d19": "success-color-90",
				"#339933": "success-color-80",
				"#4da64d": "success-color-70",
				"#66b366": "success-color-60",
				"#80c080": "success-color-50",
				"#99cc99": "success-color-40",
				"#b3d9b3": "success-color-30",
				"#cce6cc": "success-color-20",
				"#e6f2e6": "success-color-10",
				"#f2f9f2": "success-color-5",
				"#ca1919": "danger-color-90",
				"#d03333": "danger-color-80",
				"#d64d4d": "danger-color-70",
				"#dc6666": "danger-color-60",
				"#e28080": "danger-color-50",
				"#e79999": "danger-color-40",
				"#edb3b3": "danger-color-30",
				"#f3cccc": "danger-color-20",
				"#f9e6e6": "danger-color-10",
				"#fcf2f2": "danger-color-5",
				"#d57719": "warning-color-90",
				"#d98633": "warning-color-80",
				"#de954d": "warning-color-70",
				"#e3a466": "warning-color-60",
				"#e8b480": "warning-color-50",
				"#ecc399": "warning-color-40",
				"#f1d2b3": "warning-color-30",
				"#f6e1cc": "warning-color-20",
				"#faf0e6": "warning-color-10",
				"#fdf7f2": "warning-color-5",
				"#1982ca": "info-color-90",
				"#3390d0": "info-color-80",
				"#4d9ed6": "info-color-70",
				"#66acdc": "info-color-60",
				"#80bae2": "info-color-50",
				"#99c7e7": "info-color-40",
				"#b3d5ed": "info-color-30",
				"#cce3f3": "info-color-20",
				"#e6f1f9": "info-color-10",
				"#f2f8fc": "info-color-5"
			},
			"STG": {
				"#e30000": "color-A",
				"#78be20": "color-B",
				"#858370": "color-C",
				"#004833": "color-D",
				"#c30000": "color-G",
				"#00ff00": "success-color",
				"#c40000": "danger-color",
				"#d06800": "warning-color",
				"#0074c4": "info-color",
				"#e61919": "color-A-90",
				"#e93333": "color-A-80",
				"#eb4d4d": "color-A-70",
				"#ee6666": "color-A-60",
				"#f18080": "color-A-50",
				"#f49999": "color-A-40",
				"#f7b3b3": "color-A-30",
				"#f9cccc": "color-A-20",
				"#fce6e6": "color-A-10",
				"#fef2f2": "color-A-5",
				"#86c536": "color-B-90",
				"#93cb4d": "color-B-80",
				"#a1d263": "color-B-70",
				"#aed879": "color-B-60",
				"#bcdf90": "color-B-50",
				"#c9e5a6": "color-B-40",
				"#d7ecbc": "color-B-30",
				"#e4f2d2": "color-B-20",
				"#f2f9e9": "color-B-10",
				"#f8fcf4": "color-B-5",
				"#918f7e": "color-C-90",
				"#9d9c8d": "color-C-80",
				"#aaa89b": "color-C-70",
				"#b6b5a9": "color-C-60",
				"#c2c1b8": "color-C-50",
				"#cecdc6": "color-C-40",
				"#dadad4": "color-C-30",
				"#e7e6e2": "color-C-20",
				"#f3f3f1": "color-C-10",
				"#f9f9f8": "color-C-5",
				"#195a47": "color-D-90",
				"#336d5c": "color-D-80",
				"#4d7f70": "color-D-70",
				"#669185": "color-D-60",
				"#80a499": "color-D-50",
				"#99b6ad": "color-D-40",
				"#b3c8c2": "color-D-30",
				"#ccdad6": "color-D-20",
				"#e6edeb": "color-D-10",
				"#f2f6f5": "color-D-5",
				"#c91919": "color-G-90",
				"#cf3333": "color-G-80",
				"#d54d4d": "color-G-70",
				"#db6666": "color-G-60",
				"#e18080": "color-G-50",
				"#e79999": "color-G-40",
				"#edb3b3": "color-G-30",
				"#f3cccc": "color-G-20",
				"#f9e6e6": "color-G-10",
				"#fcf2f2": "color-G-5",
				"#918f7e": "color-Gray-90",
				"#9d9c8d": "color-Gray-80",
				"#aaa89b": "color-Gray-70",
				"#b6b5a9": "color-Gray-60",
				"#c2c1b8": "color-Gray-50",
				"#cecdc6": "color-Gray-40",
				"#dadad4": "color-Gray-30",
				"#e7e6e2": "color-Gray-20",
				"#f3f3f1": "color-Gray-10",
				"#f9f9f8": "color-Gray-5",
				"#198d19": "success-color-90",
				"#339933": "success-color-80",
				"#4da64d": "success-color-70",
				"#66b366": "success-color-60",
				"#80c080": "success-color-50",
				"#99cc99": "success-color-40",
				"#b3d9b3": "success-color-30",
				"#cce6cc": "success-color-20",
				"#e6f2e6": "success-color-10",
				"#f2f9f2": "success-color-5",
				"#ca1919": "danger-color-90",
				"#d03333": "danger-color-80",
				"#d64d4d": "danger-color-70",
				"#dc6666": "danger-color-60",
				"#e28080": "danger-color-50",
				"#e79999": "danger-color-40",
				"#edb3b3": "danger-color-30",
				"#f3cccc": "danger-color-20",
				"#f9e6e6": "danger-color-10",
				"#fcf2f2": "danger-color-5",
				"#d57719": "warning-color-90",
				"#d98633": "warning-color-80",
				"#de954d": "warning-color-70",
				"#e3a466": "warning-color-60",
				"#e8b480": "warning-color-50",
				"#ecc399": "warning-color-40",
				"#f1d2b3": "warning-color-30",
				"#f6e1cc": "warning-color-20",
				"#faf0e6": "warning-color-10",
				"#fdf7f2": "warning-color-5",
				"#1982ca": "info-color-90",
				"#3390d0": "info-color-80",
				"#4d9ed6": "info-color-70",
				"#66acdc": "info-color-60",
				"#80bae2": "info-color-50",
				"#99c7e7": "info-color-40",
				"#b3d5ed": "info-color-30",
				"#cce3f3": "info-color-20",
				"#e6f1f9": "info-color-10",
				"#f2f8fc": "info-color-5"
			},
			"WBC": {
				"#d5002b": "color-A",
				"#621a4b": "color-B",
				"#2d373e": "color-C",
				"#9f0029": "color-D",
				"#d7d2cb": "color-E",
				"#f4f3f0": "color-F",
				"#e4e1da": "color-G",
				"#efede9": "color-H",
				"#00ff00": "success-color",
				"#c40000": "danger-color",
				"#d06800": "warning-color",
				"#0074c4": "info-color",
				"#d91940": "color-A-90",
				"#dd3355": "color-A-80",
				"#e24d6b": "color-A-70",
				"#e66680": "color-A-60",
				"#ea8095": "color-A-50",
				"#ee99aa": "color-A-40",
				"#f2b3bf": "color-A-30",
				"#f7ccd5": "color-A-20",
				"#fbe6ea": "color-A-10",
				"#fdf2f4": "color-A-5",
				"#72315d": "color-B-90",
				"#81486f": "color-B-80",
				"#915f81": "color-B-70",
				"#a17693": "color-B-60",
				"#b18da5": "color-B-50",
				"#c0a3b7": "color-B-40",
				"#d0bac9": "color-B-30",
				"#e0d1db": "color-B-20",
				"#efe8ed": "color-B-10",
				"#f7f4f6": "color-B-5",
				"#424b51": "color-C-90",
				"#575f65": "color-C-80",
				"#6c7378": "color-C-70",
				"#81878b": "color-C-60",
				"#969b9f": "color-C-50",
				"#abafb2": "color-C-40",
				"#c0c3c5": "color-C-30",
				"#d5d7d8": "color-C-20",
				"#eaebec": "color-C-10",
				"#f5f5f5": "color-C-5",
				"#a9193e": "color-D-90",
				"#b23354": "color-D-80",
				"#bc4d69": "color-D-70",
				"#c5667f": "color-D-60",
				"#cf8094": "color-D-50",
				"#d999a9": "color-D-40",
				"#e2b3bf": "color-D-30",
				"#ecccd4": "color-D-20",
				"#f5e6ea": "color-D-10",
				"#faf2f4": "color-D-5",
				"#424b51": "color-Gray-90",
				"#575f65": "color-Gray-80",
				"#6c7378": "color-Gray-70",
				"#81878b": "color-Gray-60",
				"#969b9f": "color-Gray-50",
				"#abafb2": "color-Gray-40",
				"#c0c3c5": "color-Gray-30",
				"#d5d7d8": "color-Gray-20",
				"#eaebec": "color-Gray-10",
				"#f5f5f5": "color-Gray-5",
				"#198d19": "success-color-90",
				"#339933": "success-color-80",
				"#4da64d": "success-color-70",
				"#66b366": "success-color-60",
				"#80c080": "success-color-50",
				"#99cc99": "success-color-40",
				"#b3d9b3": "success-color-30",
				"#cce6cc": "success-color-20",
				"#e6f2e6": "success-color-10",
				"#f2f9f2": "success-color-5",
				"#ca1919": "danger-color-90",
				"#d03333": "danger-color-80",
				"#d64d4d": "danger-color-70",
				"#dc6666": "danger-color-60",
				"#e28080": "danger-color-50",
				"#e79999": "danger-color-40",
				"#edb3b3": "danger-color-30",
				"#f3cccc": "danger-color-20",
				"#f9e6e6": "danger-color-10",
				"#fcf2f2": "danger-color-5",
				"#d57719": "warning-color-90",
				"#d98633": "warning-color-80",
				"#de954d": "warning-color-70",
				"#e3a466": "warning-color-60",
				"#e8b480": "warning-color-50",
				"#ecc399": "warning-color-40",
				"#f1d2b3": "warning-color-30",
				"#f6e1cc": "warning-color-20",
				"#faf0e6": "warning-color-10",
				"#fdf7f2": "warning-color-5",
				"#1982ca": "info-color-90",
				"#3390d0": "info-color-80",
				"#4d9ed6": "info-color-70",
				"#66acdc": "info-color-60",
				"#80bae2": "info-color-50",
				"#99c7e7": "info-color-40",
				"#b3d5ed": "info-color-30",
				"#cce3f3": "info-color-20",
				"#e6f1f9": "info-color-10",
				"#f2f8fc": "info-color-5"
			}
		};
	}
}