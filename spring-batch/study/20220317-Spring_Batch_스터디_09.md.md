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
- Step을 실행시키는 Job 구현체 
- SimpleJobBuilder에 의해 생성됨
- 여러 단계의 Step으로 구성 가능
	- 여러 단계를 순차적으로 실행
- 모든 Step이 완료되어야 최종적으로 Job이 완료됨
- 맨 마지막에 실행한 Step의 BatchStatus가 최종 BatchStatus가 됨

## jobBuilderFactory.get("jobName")
- JobBuilder를 생성, Job 이름을 매개변수로 받음

## start()
- 처음 실행하는 Step, SimpleJobBuilder 반환

## next()
- 다음에 실행할 Step
- 모든 next()가 종료시 Job이 종료됨

## incrementer
- JobParameter의 값을 자동 증가해주는 JobParametersIncrementer 설정

## validator
- JobParameter 실행 전 검증하는 JobParameterValidator 설정

## listener
- Job 라이프 사이클 중간에 콜백 제공받는 JobExecutionListener 설정
