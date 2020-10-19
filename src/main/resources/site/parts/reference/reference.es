//import {toStr} from '/lib/util';
//import {getComponent} from '/lib/xp/portal';

export function get() {
	//const component = getComponent();
	//log.info(`part component:${toStr(component)}`);

	return {
		body: '<div data-portal-component-type="part">Part</div>',
		contentType: 'text/html; charset=utf-8'
	};
}
