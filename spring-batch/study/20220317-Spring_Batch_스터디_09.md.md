# Job and Step
- Spring Batch는 Job, Step을 쉽게 생성, 설정 할 수 있는 Util성 빌더 클래스를 제공함
- JobBuilderFactory & JobBuilder : 여러 종류의 Job을 생성하는 하위 Builder들 존재
- SimpleJob, TaskletStep : 기본적인 구현체

# JobBuilderFactory / JobBuilder
## JobBuilderFactory 
- JobBuilder를 생성하는 Factory Class
- jobBuilderFactory.get("jobName")
	- Spring Batch가 Job 실행시 참조하는 Job의 이름

## JobBuilder
- Job 구성하는 `설정 조건`에 따라 두 개의 하위 빌더 클래스를 생성
	- start(step) -> SimpleJobBuilder
	- start(flow) -> FlowJobBuilder
	- flow(step) -> FlowJobBuilder
- SimpleJobBuilder, FlowJobBuilder 등 하위 빌더 클래스에게 실제 Job 생성을 위임
- SimpleJobBuilder
	- SimpleJob 생성 하는 Builder
	- Job 실행 관련 API 제공
- FlowJobBuilder
	- FlowJob을 생성하는 Builder
	- Job 실행 관련 API 제공

# SimpleJob
- [ ] 내용 추가 
