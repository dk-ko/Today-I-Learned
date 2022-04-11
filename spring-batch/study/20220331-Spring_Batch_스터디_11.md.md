# SimpleJob-Incrementer()
- JobParameters의 값을 증가, 다음에 사용될 `JobParameter`를 `리턴`함
	- JobLauncher가 Job, JobParameter 를 받아서 run 하는데, **JP의 값은 해당 Job을 유일하게 식별할 수 있는 값**
	- **파라미터의 값이 동일하면 Job을 실행시킬 수 없다**
	- 그래서 실패하지 않아도, 재시작이 필요한 경우 사용함.
- Spring Boot에서 RunIdIncrementer 구현체를 지원하며, 인터페이스를 직접 구현할 수도 있음.
- 기존의 JobParameter 변경 없이 Job을 `여러번 실행`하고자 할 때 사용 

```java
// (1) 구조 
JobParametersIncrementer.getNext(JobParameters)

// (2) API 사용 
.incrementer(JobParametersIncrementer)
```


- 실습
	- JobParameter의 기존 값은 변경하면 X
		- 식별하기 위한 값은 변경되면 안되고, 다시 실행하기 위한 값만 변경해야한다.
	- 즉 추가만 해야한다 (addXXX 메소드)
		- 즉 내가 추가한 Key에 매핑되는 데이터가 계속해서 변경되며 JP의 값도 변경되는 것
	- 실행시 넘기는 Paramter와 Increment에서 JP 데이터를 추가할 수 있다.
	- 사용 목적 ) Job을 여러번 실행하고자 할 때



# SimpleJob 아키텍처
- SpringBatch가 SimpleJob을 실행할 때 흐름도 
- Job->Step->Tasklet
	- 과정마다 메타 데이터가 생성되어 DB에 저장됨.

- JobLauncher(JobParameters, SimpleJob) -> Job을 실행시킴
- SimpleJob -> 자신이 갖고 있는 Step들을 실행시킴
	- Step -> 자신이 갖고 있는 Tasklet을 실행
	- 첫번째 Step -> 두번째 Step (순차적)
	- 계속 루프를 돌다가 모든 Step을 실행함
	- 모든 과정이 끝나면 return함
## 각 과정마다 저장되는 메타데이터
- JobLauncher -> SimpleJob
	- JobInstance 객체 생성
		- Job이 실행될 때 유일한 값을 가진 객체 (구분용)
		- JobExecution 생성
			- JI에 대한 한번의 실행
			- JI : JE = 1 : N
			- ExecutionContext 객체를 갖고 있음

- SimpleJob -> Step
	- JobListener
		- Job 관련 메타 데이터 저장하는 도메인 객체들은 이전 세개 (JobInstance, JobExecution, ExecutionContext)
		- JobListener를 등록한다면 
		- SimpleJob, Step 사이에서 beforeJob()을 호출
		- Job 실행전 미리 실행됨


- Step -> Tasklet
	- StepExecution
		- ExecutionContext 생성 
	- 각 Step 마다 생성됨


- SimpleJob <- Step
	- Step이 종료되면 SimpleJob으로 가는데
그때 Listener가 다시 실행되는데
afterJob()을 실행함.

- JobLauncher <- SimpleJob
	- JobExecution의 값 중 BatchStatus, ExitStatus를 update
	- 그 때 `마지막 Step의 상태`와 같게 설정한다.
	

## 클래스 상속 관계도

![[./2022.03.image/D646B087-28A1-489F-ACB5-3BF93631175E.jpeg]]

# StepBuilderFactory / StepBuilder

- 실제 Step을 생성하는건 StepBuilder의 하위 Builder 클래스들 
	- TaskletStepBuilder : TaskletStep을 생성하는 기본 빌더 클래스
	- SimpleStepBuilder : 동일 하게 TaskletStep을 생성하지만 청크 기반의 작업을 처리하는 ChunkOrientedTakelet을 생성 
	- PartitonStepBuilder : PartitionStep을 생성, 멀티 스레드 방식으로 Job 실행
	- JobStepBuilder : JobStep을 생성, Step안에서 Job을 실행
	- FlowStepBuilder : FlowStep 생성, Step 안에서 Flow 실행


- StepBuilderFactory.getName(stepName) -> StepBuilder 실행 -> 하위 빌더 생성 
	- API 파라미터 타입에 따라 맞는 하위 빌더가 생성됨.
	- .taklet(tasklet()) -> TaskletStepBuilder
	- .chunk(chunkSize) -> SimpleStepBuilder
	- .chunk(completionPolicy) -> SimpleStepBuilder
	- .partitioner(stepName, partitioner) -> PartitionStepBuilder
	- partition(step) -> PartitionStepBuilder
	- job(job) -> JobStepBuilder
	- flow(flow) -> FlowStepBuilder

- 상속구조
	- StepBuilderFactory -> StepBuilderHelper
	- AbstrackTaskletStepBuilder, StepBuilder, PartitonStepBuilder, JobStepBuilder, FlowStepBuilder -> StepBuilderHelper
	- TaskletStepBuilder, SimpleStepBuilder -> AbstractTaskletStepBuilder, TaskletStep
	- TaskletStepBuilder, SimpleStepBuilder -> TaskletStep
