project := homepage-350115
service := ll
region := us-west1
image := gcr.io/$(project)/$(service)

# TODO: Separate run and build from docker analogues.

run: build
	docker run --rm -p 8080:8080 $(image)
.PHONY: run

build:
	docker build -t $(image) .
.PHONY: upload

###########################################################
# Deploy
###########################################################

# Building locally on a Mac produces a binary unusable by Cloud Run. So let
# Cloud Build take care of building on Mac, but do it locally on Linux.
ifeq ($(shell uname),Darwin)
	deploy_method := deploy-source
else
	deploy_method := deploy-image
endif

deploy-site: $(deploy_method)
.PHONY: deploy-site

deploy-no-build:
	gcloud --project $(project) \
		run deploy $(service) \
		--image $(image) \
		--region $(region) \
		--allow-unauthenticated
.PHONY: deploy-no-build

deploy-image: build
	docker push $(image)
	gcloud --project $(project) \
		run deploy $(service) \
		--image $(image) \
		--region $(region) \
		--allow-unauthenticated
.PHONY: deploy-image

deploy-source:
	gcloud --project $(project) \
		run deploy $(service) \
		--source . \
		--region $(region) \
		--allow-unauthenticated
.PHONY: deploy-source
