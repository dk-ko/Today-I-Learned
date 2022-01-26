# Job
- 배치 계층 최상위 개념, 하나의 배치 작업 의미 
	- 배치 = Job 자체를 의미
- Job Configuration을 통해 생성되는 객체 단위.
- 배치를 어떻게 구성하고 실행할지 명세해 놓은 객체
- `Job` -> Job 구성을 위한 최상위 인터페이스
	- Spring Batch가 기본 구현체 제공함
- 여러 Step을 포함한 `Container`로 한 개 이상의 `Step`으로 이루어짐

## 기본 구현체
- SimpleJob
	- Step을 순차적으로 실행시키는 Job
		- ex) Step1 -> Step2 -> Step3
	- 모든 Job에서 표준적으로 사용하는 기능이 들어있음
	- Step 객체를 갖고 있음
- FlowJob
	- 특정 조건에 따라 흐름을 제어할 수 있는 Job
		- ex) Step1 -> (if) -> Step3
	- Flow 객체를 갖고 있음 

## Job 도메인 객체 이해
- 실행 과정
`JobParameters`
	|
	|
	|
`JobLauncher` >---run(job, parameters)--> `Job`--execute()--> `List<Step>`


- 클래스 구조 
	`Job`
void execute(JobExecution)
	|
	|
`AbstractJob`
-name
-restarable
-JobRepository
-JobExecutionListener
-JobParametersIncrementer
-JobParametersValidator
-SimpleStepHandler


`SimpleStepHandler` <--- `SimpleJob` (Steps)
					<--- `FlowJob` (Flow)



- `JobParameters,` `JobLauncher` 두개 파라미터를 가지고 `run()`
- `Job.execute()`로 `List<Step>`을 실행
	- Step은 SimpleJob에서 구현체 제공
- `AbstractJob`에서 `SimpleStepHandler`가 `Step`을 실행함


