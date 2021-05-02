build:
	pack build jordanyong/apollo-federated-gateway --builder gcr.io/buildpacks/builder:v1
publish:
	docker push jordanyong/apollo-federated-gateway
helm-update:
	helm dependency update charts
release:
	helm upgrade --install apollo-federated-gateway charts