.PHONY: help up up-perf up-grafana reset grafana test test-basic test-e2e test-feeds

ENV ?= des
ENV_FILE = .env_$(ENV)

ifeq (true,$(shell test -f $(ENV_FILE) && echo true))
	include $(ENV_FILE)
	export $(shell sed 's/=.*//' $(ENV_FILE))
endif


help:
	@echo "Usage: make <command>"
	@echo ""
	@echo "Available commands:"
	@echo "  up          Brings up the Docker Compose environment in the environment defined by ENV (default: des)."
	@echo "              Uses the .env_$(ENV) file for configuration."
	@echo ""
	@echo "  up-perf     Brings up the complete Docker Compose environment including performance services (k6 and monitoring)."
	@echo "              Uses the .env_$(ENV) file and the 'perf' profile."
	@echo ""
	@echo "  up-grafana  Brings up only the Grafana service using the .env_$(ENV) file and the 'perf' profile."
	@echo ""
	@echo "  grafana     Opens the Grafana dashboard in the browser (http://localhost:3001)."
	@echo ""
	@echo "  reset       Brings down all Docker Compose services and removes associated volumes."
	@echo "              Uses the .env_$(ENV) file."
	@echo ""
	@echo "  test        Executes a generic k6 test inside a Docker container."
	@echo "              Uses the script specified by the SCRIPT variable (default: load_test_feeds_performance.js)."
	@echo "              Example: make test SCRIPT=my_test.js"
	@echo ""
	@echo "  test-basic  Executes the basic k6 test using the load_basic_structured_test.js script."
	@echo ""
	@echo "  test-e2e    Executes the end-to-end k6 test using the load_test_e2e_api.js script."
	@echo ""
	@echo "  test-feeds  Executes the feeds k6 test using the load_test_feeds_performance.js script."
	@echo ""
	@echo "Environment Variables:"
	@echo "  ENV         Defines the environment to use (des, prod, etc.). Default is 'des'."
	@echo "              Example: make up ENV=prod"

up:
	docker-compose --env-file $(ENV_FILE) up -d
up-perf:
	docker-compose --env-file $(ENV_FILE) --profile perf up -d
up-grafana:
	docker-compose --env-file .env_$(ENV) --profile perf up -d grafana
# Dashboard Grafana
grafana:
	open http://localhost:3001

reset:
	docker-compose stop grafana influxdb
	docker-compose --env-file $(ENV_FILE) down -v --remove-orphans

test SCRIPT?=load_test_feeds_performance.js:
	@make up-grafana ENV=$(ENV)
	docker-compose --env-file $(ENV_FILE) --profile perf run --rm \
		-e SCRIPT_NAME=$(SCRIPT) \
		k6

test-basic:
	make test SCRIPT=load_basic_structured_test.js ENV=$(ENV)

test-e2e:
	make test SCRIPT=load_test_e2e_api.js ENV=$(ENV)

test-feeds:
	make test SCRIPT=load_test_feeds_performance.js ENV=$(ENV)
