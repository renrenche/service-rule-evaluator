.PHONY: test
publish:
	# 确保 当前源 在npm 上
	npm config set registry https://registry.npmjs.org/
	npm publish
	