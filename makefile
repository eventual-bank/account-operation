deploy-us-west:
	sam build;sam deploy --config-file samconfig.us-west.toml

deploy:
	sam build;sam deploy

delete:
	sam delete