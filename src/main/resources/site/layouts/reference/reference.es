import {toStr} from '/lib/util';
import {getComponent} from '/lib/xp/portal';

export function get(request) {
	const {mode} = request;

	const component = getComponent();
	log.info(`layout component:${toStr(component)}`);

	const {components} = component.regions.main;
	log.info(`layout components:${toStr(components)}`);

	return {
		body: `<main data-portal-component-type="layout" ${mode === 'edit' ? 'data-portal-region="main"' : ''}>
			${(components && components.length)
		? components.map((c) => `<!--# COMPONENT ${c.path} -->`)
		: ''}
	</main>`,
		contentType: 'text/html; charset=utf-8'
	};
}
