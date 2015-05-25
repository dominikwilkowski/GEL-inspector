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
		var BOMVariable = COLORS['BOM'][ color ] ? 'BOM: ' + COLORS['BOM'][ color ] : '! '+color;
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

		for(var i = style.length - 1; i >= 0; i--) {

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

		if(DEBUG) console.log('%cDuplications: ' + ticked, 'font-size:20px;');

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
				"#685ac0": "color-B",
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
				"#716f7d": "color-C",
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
				"#403489": "color-D",
				"#534895": "color-D-90",
				"#665da1": "color-D-80",
				"#7971ac": "color-D-70",
				"#8c85b8": "color-D-60",
				"#a09ac4": "color-D-50",
				"#b3aed0": "color-D-40",
				"#c6c2dc": "color-D-30",
				"#d9d6e7": "color-D-20",
				"#ecebf3": "color-D-10",
				"#f5f5f9": "color-D-5",
				"#11b6af": "color-E",
				"#29bdb7": "color-E-90",
				"#41c5bf": "color-E-80",
				"#58ccc7": "color-E-70",
				"#70d3cf": "color-E-60",
				"#88dbd7": "color-E-50",
				"#a0e2df": "color-E-40",
				"#b8e9e7": "color-E-30",
				"#cff0ef": "color-E-20",
				"#e7f8f7": "color-E-10",
				"#f3fbfb": "color-E-5",
				"#0d0d0d": "color-F",
				"#252525": "color-F-90",
				"#3d3d3d": "color-F-80",
				"#565656": "color-F-70",
				"#6e6e6e": "color-F-60",
				"#868686": "color-F-50",
				"#9e9e9e": "color-F-40",
				"#b6b6b6": "color-F-30",
				"#cfcfcf": "color-F-20",
				"#e7e7e7": "color-F-10",
				"#f3f3f3": "color-F-5",
				"#716f7d": "color-G",
				"#7f7d8a": "color-G-90",
				"#8d8c97": "color-G-80",
				"#9c9aa4": "color-G-70",
				"#aaa9b1": "color-G-60",
				"#b8b7be": "color-G-50",
				"#c6c5cb": "color-G-40",
				"#d4d4d8": "color-G-30",
				"#e3e2e5": "color-G-20",
				"#f1f1f2": "color-G-10",
				"#f8f8f9": "color-G-5",
				"#c6c5cb": "color-H",
				"#cccbd0": "color-H-90",
				"#d1d1d5": "color-H-80",
				"#d7d6db": "color-H-70",
				"#dddce0": "color-H-60",
				"#e3e2e5": "color-H-50",
				"#e8e8ea": "color-H-40",
				"#eeeeef": "color-H-30",
				"#f4f3f5": "color-H-20",
				"#f9f9fa": "color-H-10",
				"#fcfcfc": "color-H-5",
				"#f1f1f2": "color-I",
				"#f2f2f3": "color-I-90",
				"#f4f4f5": "color-I-80",
				"#f5f5f6": "color-I-70",
				"#f7f7f7": "color-I-60",
				"#f8f8f9": "color-I-50",
				"#f9f9fa": "color-I-40",
				"#fbfbfb": "color-I-30",
				"#fcfcfc": "color-I-20",
				"#fefefe": "color-I-10",
				"#fefefe": "color-I-5",
				"#f8f8f8": "color-J",
				"#f9f9f9": "color-J-90",
				"#f9f9f9": "color-J-80",
				"#fafafa": "color-J-70",
				"#fbfbfb": "color-J-60",
				"#fcfcfc": "color-J-50",
				"#fcfcfc": "color-J-40",
				"#fdfdfd": "color-J-30",
				"#fefefe": "color-J-20",
				"#fefefe": "color-J-10",
				"#ffffff": "color-J-5",
				"#008000": "color-Success",
				"#198d19": "color-Success-90",
				"#339933": "color-Success-80",
				"#4da64d": "color-Success-70",
				"#66b366": "color-Success-60",
				"#80c080": "color-Success-50",
				"#99cc99": "color-Success-40",
				"#b3d9b3": "color-Success-30",
				"#cce6cc": "color-Success-20",
				"#e6f2e6": "color-Success-10",
				"#f2f9f2": "color-Success-5",
				"#c40000": "color-Danger",
				"#ca1919": "color-Danger-90",
				"#d03333": "color-Danger-80",
				"#d64d4d": "color-Danger-70",
				"#dc6666": "color-Danger-60",
				"#e28080": "color-Danger-50",
				"#e79999": "color-Danger-40",
				"#edb3b3": "color-Danger-30",
				"#f3cccc": "color-Danger-20",
				"#f9e6e6": "color-Danger-10",
				"#fcf2f2": "color-Danger-5",
				"#d06800": "color-Warning",
				"#d57719": "color-Warning-90",
				"#d98633": "color-Warning-80",
				"#de954d": "color-Warning-70",
				"#e3a466": "color-Warning-60",
				"#e8b480": "color-Warning-50",
				"#ecc399": "color-Warning-40",
				"#f1d2b3": "color-Warning-30",
				"#f6e1cc": "color-Warning-20",
				"#faf0e6": "color-Warning-10",
				"#fdf7f2": "color-Warning-5",
				"#0074c4": "color-Info",
				"#1982ca": "color-Info-90",
				"#3390d0": "color-Info-80",
				"#4d9ed6": "color-Info-70",
				"#66acdc": "color-Info-60",
				"#80bae2": "color-Info-50",
				"#99c7e7": "color-Info-40",
				"#b3d5ed": "color-Info-30",
				"#cce3f3": "color-Info-20",
				"#e6f1f9": "color-Info-10",
				"#f2f8fc": "color-Info-5"
			},
			"BSA": {
				"#c0142e": "color-A",
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
				"#365fb4": "color-B",
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
				"#333333": "color-C",
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
				"#36528a": "color-D",
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
				"#178bc4": "color-E",
				"#2e97ca": "color-E-90",
				"#45a2d0": "color-E-80",
				"#5daed6": "color-E-70",
				"#74b9dc": "color-E-60",
				"#8bc5e2": "color-E-50",
				"#a2d1e7": "color-E-40",
				"#b9dced": "color-E-30",
				"#d1e8f3": "color-E-20",
				"#e8f3f9": "color-E-10",
				"#f3f9fc": "color-E-5",
				"#333333": "color-F",
				"#474747": "color-F-90",
				"#5c5c5c": "color-F-80",
				"#707070": "color-F-70",
				"#858585": "color-F-60",
				"#999999": "color-F-50",
				"#adadad": "color-F-40",
				"#c2c2c2": "color-F-30",
				"#d6d6d6": "color-F-20",
				"#ebebeb": "color-F-10",
				"#f5f5f5": "color-F-5",
				"#707070": "color-G",
				"#7e7e7e": "color-G-90",
				"#8d8d8d": "color-G-80",
				"#9b9b9b": "color-G-70",
				"#a9a9a9": "color-G-60",
				"#b8b8b8": "color-G-50",
				"#c6c6c6": "color-G-40",
				"#d4d4d4": "color-G-30",
				"#e2e2e2": "color-G-20",
				"#f1f1f1": "color-G-10",
				"#f8f8f8": "color-G-5",
				"#c2c2c2": "color-H",
				"#c8c8c8": "color-H-90",
				"#cecece": "color-H-80",
				"#d4d4d4": "color-H-70",
				"#dadada": "color-H-60",
				"#e1e1e1": "color-H-50",
				"#e7e7e7": "color-H-40",
				"#ededed": "color-H-30",
				"#f3f3f3": "color-H-20",
				"#f9f9f9": "color-H-10",
				"#fcfcfc": "color-H-5",
				"#ebebeb": "color-I",
				"#ededed": "color-I-90",
				"#efefef": "color-I-80",
				"#f1f1f1": "color-I-70",
				"#f3f3f3": "color-I-60",
				"#f5f5f5": "color-I-50",
				"#f7f7f7": "color-I-40",
				"#f9f9f9": "color-I-30",
				"#fbfbfb": "color-I-20",
				"#fdfdfd": "color-I-10",
				"#fefefe": "color-I-5",
				"#f5f5f5": "color-J",
				"#f6f6f6": "color-J-90",
				"#f7f7f7": "color-J-80",
				"#f8f8f8": "color-J-70",
				"#f9f9f9": "color-J-60",
				"#fafafa": "color-J-50",
				"#fbfbfb": "color-J-40",
				"#fcfcfc": "color-J-30",
				"#fdfdfd": "color-J-20",
				"#fefefe": "color-J-10",
				"#ffffff": "color-J-5",
				"#008000": "color-Success",
				"#198d19": "color-Success-90",
				"#339933": "color-Success-80",
				"#4da64d": "color-Success-70",
				"#66b366": "color-Success-60",
				"#80c080": "color-Success-50",
				"#99cc99": "color-Success-40",
				"#b3d9b3": "color-Success-30",
				"#cce6cc": "color-Success-20",
				"#e6f2e6": "color-Success-10",
				"#f2f9f2": "color-Success-5",
				"#c40000": "color-Danger",
				"#ca1919": "color-Danger-90",
				"#d03333": "color-Danger-80",
				"#d64d4d": "color-Danger-70",
				"#dc6666": "color-Danger-60",
				"#e28080": "color-Danger-50",
				"#e79999": "color-Danger-40",
				"#edb3b3": "color-Danger-30",
				"#f3cccc": "color-Danger-20",
				"#f9e6e6": "color-Danger-10",
				"#fcf2f2": "color-Danger-5",
				"#d06800": "color-Warning",
				"#d57719": "color-Warning-90",
				"#d98633": "color-Warning-80",
				"#de954d": "color-Warning-70",
				"#e3a466": "color-Warning-60",
				"#e8b480": "color-Warning-50",
				"#ecc399": "color-Warning-40",
				"#f1d2b3": "color-Warning-30",
				"#f6e1cc": "color-Warning-20",
				"#faf0e6": "color-Warning-10",
				"#fdf7f2": "color-Warning-5",
				"#0074c4": "color-Info",
				"#1982ca": "color-Info-90",
				"#3390d0": "color-Info-80",
				"#4d9ed6": "color-Info-70",
				"#66acdc": "color-Info-60",
				"#80bae2": "color-Info-50",
				"#99c7e7": "color-Info-40",
				"#b3d5ed": "color-Info-30",
				"#cce3f3": "color-Info-20",
				"#e6f1f9": "color-Info-10",
				"#f2f8fc": "color-Info-5"
			},
			"STG": {
				"#e30000": "color-A",
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
				"#78be20": "color-B",
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
				"#858370": "color-C",
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
				"#004833": "color-D",
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
				"#ffcd00": "color-E",
				"#ffd219": "color-E-90",
				"#ffd733": "color-E-80",
				"#ffdc4d": "color-E-70",
				"#ffe166": "color-E-60",
				"#ffe680": "color-E-50",
				"#ffeb99": "color-E-40",
				"#fff0b3": "color-E-30",
				"#fff5cc": "color-E-20",
				"#fffae6": "color-E-10",
				"#fffdf2": "color-E-5",
				"#004833": "color-F",
				"#195a47": "color-F-90",
				"#336d5c": "color-F-80",
				"#4d7f70": "color-F-70",
				"#669185": "color-F-60",
				"#80a499": "color-F-50",
				"#99b6ad": "color-F-40",
				"#b3c8c2": "color-F-30",
				"#ccdad6": "color-F-20",
				"#e6edeb": "color-F-10",
				"#f2f6f5": "color-F-5",
				"#858370": "color-G",
				"#918f7e": "color-G-90",
				"#9d9c8d": "color-G-80",
				"#aaa89b": "color-G-70",
				"#b6b5a9": "color-G-60",
				"#c2c1b8": "color-G-50",
				"#cecdc6": "color-G-40",
				"#dadad4": "color-G-30",
				"#e7e6e2": "color-G-20",
				"#f3f3f1": "color-G-10",
				"#f9f9f8": "color-G-5",
				"#cecdc6": "color-H",
				"#d3d2cc": "color-H-90",
				"#d8d7d1": "color-H-80",
				"#dddcd7": "color-H-70",
				"#e2e1dd": "color-H-60",
				"#e7e6e3": "color-H-50",
				"#ebebe8": "color-H-40",
				"#f0f0ee": "color-H-30",
				"#f5f5f4": "color-H-20",
				"#fafaf9": "color-H-10",
				"#fdfdfc": "color-H-5",
				"#f3f3f1": "color-I",
				"#f4f4f2": "color-I-90",
				"#f5f5f4": "color-I-80",
				"#f7f7f5": "color-I-70",
				"#f8f8f7": "color-I-60",
				"#f9f9f8": "color-I-50",
				"#fafaf9": "color-I-40",
				"#fbfbfb": "color-I-30",
				"#fdfdfc": "color-I-20",
				"#fefefe": "color-I-10",
				"#fefefe": "color-I-5",
				"#f9f9f8": "color-J",
				"#fafaf9": "color-J-90",
				"#fafaf9": "color-J-80",
				"#fbfbfa": "color-J-70",
				"#fbfbfb": "color-J-60",
				"#fcfcfc": "color-J-50",
				"#fdfdfc": "color-J-40",
				"#fdfdfd": "color-J-30",
				"#fefefe": "color-J-20",
				"#fefefe": "color-J-10",
				"#ffffff": "color-J-5",
				"#008000": "color-Success",
				"#198d19": "color-Success-90",
				"#339933": "color-Success-80",
				"#4da64d": "color-Success-70",
				"#66b366": "color-Success-60",
				"#80c080": "color-Success-50",
				"#99cc99": "color-Success-40",
				"#b3d9b3": "color-Success-30",
				"#cce6cc": "color-Success-20",
				"#e6f2e6": "color-Success-10",
				"#f2f9f2": "color-Success-5",
				"#c40000": "color-Danger",
				"#ca1919": "color-Danger-90",
				"#d03333": "color-Danger-80",
				"#d64d4d": "color-Danger-70",
				"#dc6666": "color-Danger-60",
				"#e28080": "color-Danger-50",
				"#e79999": "color-Danger-40",
				"#edb3b3": "color-Danger-30",
				"#f3cccc": "color-Danger-20",
				"#f9e6e6": "color-Danger-10",
				"#fcf2f2": "color-Danger-5",
				"#d06800": "color-Warning",
				"#d57719": "color-Warning-90",
				"#d98633": "color-Warning-80",
				"#de954d": "color-Warning-70",
				"#e3a466": "color-Warning-60",
				"#e8b480": "color-Warning-50",
				"#ecc399": "color-Warning-40",
				"#f1d2b3": "color-Warning-30",
				"#f6e1cc": "color-Warning-20",
				"#faf0e6": "color-Warning-10",
				"#fdf7f2": "color-Warning-5",
				"#0074c4": "color-Info",
				"#1982ca": "color-Info-90",
				"#3390d0": "color-Info-80",
				"#4d9ed6": "color-Info-70",
				"#66acdc": "color-Info-60",
				"#80bae2": "color-Info-50",
				"#99c7e7": "color-Info-40",
				"#b3d5ed": "color-Info-30",
				"#cce3f3": "color-Info-20",
				"#e6f1f9": "color-Info-10",
				"#f2f8fc": "color-Info-5"
			},
			"WBC": {
				"#d5002b": "color-A",
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
				"#621a4b": "color-B",
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
				"#2d373e": "color-C",
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
				"#9f0029": "color-D",
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
				"#680000": "color-E",
				"#771919": "color-E-90",
				"#863333": "color-E-80",
				"#954d4d": "color-E-70",
				"#a46666": "color-E-60",
				"#b48080": "color-E-50",
				"#c39999": "color-E-40",
				"#d2b3b3": "color-E-30",
				"#e1cccc": "color-E-20",
				"#f0e6e6": "color-E-10",
				"#f7f2f2": "color-E-5",
				"#2d373e": "color-F",
				"#424b51": "color-F-90",
				"#575f65": "color-F-80",
				"#6c7378": "color-F-70",
				"#81878b": "color-F-60",
				"#969b9f": "color-F-50",
				"#abafb2": "color-F-40",
				"#c0c3c5": "color-F-30",
				"#d5d7d8": "color-F-20",
				"#eaebec": "color-F-10",
				"#f5f5f5": "color-F-5",
				"#575f65": "color-G",
				"#686f74": "color-G-90",
				"#797f84": "color-G-80",
				"#898f93": "color-G-70",
				"#9a9fa3": "color-G-60",
				"#abafb2": "color-G-50",
				"#bcbfc1": "color-G-40",
				"#cdcfd1": "color-G-30",
				"#dddfe0": "color-G-20",
				"#eeeff0": "color-G-10",
				"#f7f7f7": "color-G-5",
				"#d7d2cb": "color-H",
				"#dbd7d0": "color-H-90",
				"#dfdbd5": "color-H-80",
				"#e3e0db": "color-H-70",
				"#e7e4e0": "color-H-60",
				"#ebe9e5": "color-H-50",
				"#efedea": "color-H-40",
				"#f3f2ef": "color-H-30",
				"#f7f6f5": "color-H-20",
				"#fbfbfa": "color-H-10",
				"#fdfdfc": "color-H-5",
				"#f4f3f0": "color-I",
				"#f5f4f2": "color-I-90",
				"#f6f5f3": "color-I-80",
				"#f7f7f5": "color-I-70",
				"#f8f8f6": "color-I-60",
				"#faf9f8": "color-I-50",
				"#fbfaf9": "color-I-40",
				"#fcfbfb": "color-I-30",
				"#fdfdfc": "color-I-20",
				"#fefefe": "color-I-10",
				"#fefefe": "color-I-5",
				"#f9f9f8": "color-J",
				"#fafaf9": "color-J-90",
				"#fafaf9": "color-J-80",
				"#fbfbfa": "color-J-70",
				"#fbfbfb": "color-J-60",
				"#fcfcfc": "color-J-50",
				"#fdfdfc": "color-J-40",
				"#fdfdfd": "color-J-30",
				"#fefefe": "color-J-20",
				"#fefefe": "color-J-10",
				"#ffffff": "color-J-5",
				"#008000": "color-Success",
				"#198d19": "color-Success-90",
				"#339933": "color-Success-80",
				"#4da64d": "color-Success-70",
				"#66b366": "color-Success-60",
				"#80c080": "color-Success-50",
				"#99cc99": "color-Success-40",
				"#b3d9b3": "color-Success-30",
				"#cce6cc": "color-Success-20",
				"#e6f2e6": "color-Success-10",
				"#f2f9f2": "color-Success-5",
				"#c40000": "color-Danger",
				"#ca1919": "color-Danger-90",
				"#d03333": "color-Danger-80",
				"#d64d4d": "color-Danger-70",
				"#dc6666": "color-Danger-60",
				"#e28080": "color-Danger-50",
				"#e79999": "color-Danger-40",
				"#edb3b3": "color-Danger-30",
				"#f3cccc": "color-Danger-20",
				"#f9e6e6": "color-Danger-10",
				"#fcf2f2": "color-Danger-5",
				"#d06800": "color-Warning",
				"#d57719": "color-Warning-90",
				"#d98633": "color-Warning-80",
				"#de954d": "color-Warning-70",
				"#e3a466": "color-Warning-60",
				"#e8b480": "color-Warning-50",
				"#ecc399": "color-Warning-40",
				"#f1d2b3": "color-Warning-30",
				"#f6e1cc": "color-Warning-20",
				"#faf0e6": "color-Warning-10",
				"#fdf7f2": "color-Warning-5",
				"#0074c4": "color-Info",
				"#1982ca": "color-Info-90",
				"#3390d0": "color-Info-80",
				"#4d9ed6": "color-Info-70",
				"#66acdc": "color-Info-60",
				"#80bae2": "color-Info-50",
				"#99c7e7": "color-Info-40",
				"#b3d5ed": "color-Info-30",
				"#cce3f3": "color-Info-20",
				"#e6f1f9": "color-Info-10",
				"#f2f8fc": "color-Info-5"
			}
		};
	}
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Less declaration to get all colors
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// .color-A {
// 	color-A: "@{color-A}";
// 	color-A-90: "@{color-A-90}";
// 	color-A-80: "@{color-A-80}";
// 	color-A-70: "@{color-A-70}";
// 	color-A-60: "@{color-A-60}";
// 	color-A-50: "@{color-A-50}";
// 	color-A-40: "@{color-A-40}";
// 	color-A-30: "@{color-A-30}";
// 	color-A-20: "@{color-A-20}";
// 	color-A-10: "@{color-A-10}";
// 	color-A-5: "@{color-A-5}";

// 	color-B: "@{color-B}";
// 	color-B-90: "@{color-B-90}";
// 	color-B-80: "@{color-B-80}";
// 	color-B-70: "@{color-B-70}";
// 	color-B-60: "@{color-B-60}";
// 	color-B-50: "@{color-B-50}";
// 	color-B-40: "@{color-B-40}";
// 	color-B-30: "@{color-B-30}";
// 	color-B-20: "@{color-B-20}";
// 	color-B-10: "@{color-B-10}";
// 	color-B-5: "@{color-B-5}";

// 	color-C: "@{color-C}";
// 	color-C-90: "@{color-C-90}";
// 	color-C-80: "@{color-C-80}";
// 	color-C-70: "@{color-C-70}";
// 	color-C-60: "@{color-C-60}";
// 	color-C-50: "@{color-C-50}";
// 	color-C-40: "@{color-C-40}";
// 	color-C-30: "@{color-C-30}";
// 	color-C-20: "@{color-C-20}";
// 	color-C-10: "@{color-C-10}";
// 	color-C-5: "@{color-C-5}";

// 	color-D: "@{color-D}";
// 	color-D-90: "@{color-D-90}";
// 	color-D-80: "@{color-D-80}";
// 	color-D-70: "@{color-D-70}";
// 	color-D-60: "@{color-D-60}";
// 	color-D-50: "@{color-D-50}";
// 	color-D-40: "@{color-D-40}";
// 	color-D-30: "@{color-D-30}";
// 	color-D-20: "@{color-D-20}";
// 	color-D-10: "@{color-D-10}";
// 	color-D-5: "@{color-D-5}";

// 	color-E: "@{color-E}";
// 	color-E-90: "@{color-E-90}";
// 	color-E-80: "@{color-E-80}";
// 	color-E-70: "@{color-E-70}";
// 	color-E-60: "@{color-E-60}";
// 	color-E-50: "@{color-E-50}";
// 	color-E-40: "@{color-E-40}";
// 	color-E-30: "@{color-E-30}";
// 	color-E-20: "@{color-E-20}";
// 	color-E-10: "@{color-E-10}";
// 	color-E-5: "@{color-E-5}";

// 	color-F: "@{color-F}";
// 	color-F-90: "@{color-F-90}";
// 	color-F-80: "@{color-F-80}";
// 	color-F-70: "@{color-F-70}";
// 	color-F-60: "@{color-F-60}";
// 	color-F-50: "@{color-F-50}";
// 	color-F-40: "@{color-F-40}";
// 	color-F-30: "@{color-F-30}";
// 	color-F-20: "@{color-F-20}";
// 	color-F-10: "@{color-F-10}";
// 	color-F-5: "@{color-F-5}";

// 	color-G: "@{color-G}";
// 	color-G-90: "@{color-G-90}";
// 	color-G-80: "@{color-G-80}";
// 	color-G-70: "@{color-G-70}";
// 	color-G-60: "@{color-G-60}";
// 	color-G-50: "@{color-G-50}";
// 	color-G-40: "@{color-G-40}";
// 	color-G-30: "@{color-G-30}";
// 	color-G-20: "@{color-G-20}";
// 	color-G-10: "@{color-G-10}";
// 	color-G-5: "@{color-G-5}";

// 	color-H: "@{color-H}";
// 	color-H-90: "@{color-H-90}";
// 	color-H-80: "@{color-H-80}";
// 	color-H-70: "@{color-H-70}";
// 	color-H-60: "@{color-H-60}";
// 	color-H-50: "@{color-H-50}";
// 	color-H-40: "@{color-H-40}";
// 	color-H-30: "@{color-H-30}";
// 	color-H-20: "@{color-H-20}";
// 	color-H-10: "@{color-H-10}";
// 	color-H-5: "@{color-H-5}";

// 	color-I: "@{color-I}";
// 	color-I-90: "@{color-I-90}";
// 	color-I-80: "@{color-I-80}";
// 	color-I-70: "@{color-I-70}";
// 	color-I-60: "@{color-I-60}";
// 	color-I-50: "@{color-I-50}";
// 	color-I-40: "@{color-I-40}";
// 	color-I-30: "@{color-I-30}";
// 	color-I-20: "@{color-I-20}";
// 	color-I-10: "@{color-I-10}";
// 	color-I-5: "@{color-I-5}";

// 	color-J: "@{color-J}";
// 	color-J-90: "@{color-J-90}";
// 	color-J-80: "@{color-J-80}";
// 	color-J-70: "@{color-J-70}";
// 	color-J-60: "@{color-J-60}";
// 	color-J-50: "@{color-J-50}";
// 	color-J-40: "@{color-J-40}";
// 	color-J-30: "@{color-J-30}";
// 	color-J-20: "@{color-J-20}";
// 	color-J-10: "@{color-J-10}";
// 	color-J-5: "@{color-J-5}";

// 	color-Success: "@{color-Success}";
// 	color-Success-90: "@{color-Success-90}";
// 	color-Success-80: "@{color-Success-80}";
// 	color-Success-70: "@{color-Success-70}";
// 	color-Success-60: "@{color-Success-60}";
// 	color-Success-50: "@{color-Success-50}";
// 	color-Success-40: "@{color-Success-40}";
// 	color-Success-30: "@{color-Success-30}";
// 	color-Success-20: "@{color-Success-20}";
// 	color-Success-10: "@{color-Success-10}";
// 	color-Success-5: "@{color-Success-5}";

// 	color-Danger: "@{color-Danger}";
// 	color-Danger-90: "@{color-Danger-90}";
// 	color-Danger-80: "@{color-Danger-80}";
// 	color-Danger-70: "@{color-Danger-70}";
// 	color-Danger-60: "@{color-Danger-60}";
// 	color-Danger-50: "@{color-Danger-50}";
// 	color-Danger-40: "@{color-Danger-40}";
// 	color-Danger-30: "@{color-Danger-30}";
// 	color-Danger-20: "@{color-Danger-20}";
// 	color-Danger-10: "@{color-Danger-10}";
// 	color-Danger-5: "@{color-Danger-5}";

// 	color-Warning: "@{color-Warning}";
// 	color-Warning-90: "@{color-Warning-90}";
// 	color-Warning-80: "@{color-Warning-80}";
// 	color-Warning-70: "@{color-Warning-70}";
// 	color-Warning-60: "@{color-Warning-60}";
// 	color-Warning-50: "@{color-Warning-50}";
// 	color-Warning-40: "@{color-Warning-40}";
// 	color-Warning-30: "@{color-Warning-30}";
// 	color-Warning-20: "@{color-Warning-20}";
// 	color-Warning-10: "@{color-Warning-10}";
// 	color-Warning-5: "@{color-Warning-5}";

// 	color-Info: "@{color-Info}";
// 	color-Info-90: "@{color-Info-90}";
// 	color-Info-80: "@{color-Info-80}";
// 	color-Info-70: "@{color-Info-70}";
// 	color-Info-60: "@{color-Info-60}";
// 	color-Info-50: "@{color-Info-50}";
// 	color-Info-40: "@{color-Info-40}";
// 	color-Info-30: "@{color-Info-30}";
// 	color-Info-20: "@{color-Info-20}";
// 	color-Info-10: "@{color-Info-10}";
// 	color-Info-5: "@{color-Info-5}";
// }