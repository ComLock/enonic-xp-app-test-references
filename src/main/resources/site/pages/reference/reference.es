//import {toStr} from '/lib/util';
import {getContent as getCurrentContent} from '/lib/xp/portal';

export function get(request) {
	const {mode} = request;

	const content = getCurrentContent();
	//log.info(`content:${toStr(content)}`);

	const {components} = content.page.regions.body;
	//log.info(`page components:${toStr(components)}`);

	return {
		body: `<html>
	<head>
		<title>Title</title>
	</head>
	<body>
		<div ${mode === 'edit' ? 'data-portal-region="body"' : ''}>
			${(components && components.length)
		? components.map((c) => `<!--# COMPONENT ${c.path} -->`)
		: ''}
		</div>
	</body>
</html>`,
		contentType: 'text/html; charset=utf-8'
	};
}
