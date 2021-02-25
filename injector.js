var TWCalcJSElement = document.createElement('script');
TWCalcJSElement.setAttribute('type', 'text/javascript');
TWCalcJSElement.setAttribute('language', 'javascript');
TWCalcJSElement.setAttribute('id', 'TWCalc_js');
TWCalcJSElement.innerHTML = '(' + TWCalcJS.toString() + ')()';
document.getElementsByTagName('body')[0].appendChild(TWCalcJSElement);
