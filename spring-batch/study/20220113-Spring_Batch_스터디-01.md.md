# 스프링 배치
## 스프링 배치 핵심 패턴
- READ : DB, 파일, 큐에서 `다량의 데이터 조회`
- PROCESS : 특정 방법으로 `데이터 가공`
- WRITE : 데이터를 수정된 양식으로 `다시 저장`

## 배치 시나리오
- 배치 프로세스를 `주기적으로 커밋`
- `동시` 다발적인 Job 처리, `대용량 병렬 처리`
- `실패 후` 수동 또는 스케쥴링에 의한 `재시작`
- `의존 관계`가 있는 step을 `순차적`으로 처리
- `조건 (if-else) flow 구성`으로 유연함
- `반복`, `재시도`, `skip 처리` 가능

## 스프링 배치 아키텍처
- Application : 프로그래머가 `로직` 구현하는 부분
- Batch Core: Job 실행, 모니터링, `관리하는 API`
	- JobLauncher, Job, Step, Flow 속함
	-> Job의 `명세서` (구성, 설정을 위한 것)
- Batch Infrastructure : Application, Core가 `실행되는 공통 공간`
	- Job 실행, 흐름 처리 위한 틀(?) 제공
	- Reader, Processor Writer, Skip, Retry 속함
	-> Batch Core 설정에 따라 Job을 실행하거나 데이터 처리함
	-> `실제 Batch 실행`에 관한 것

# 스프링 배치 시작
## 스프링 배치 활성화
- @EnableBatchProcessing
	- `4개의 설정 클래스`를 실행 시킴.
	- 모든 `초기화 및 실행 구성`이 이루어짐
	- 자동 설정 클래스가 실행되어서 빈으로 등록된 모든 `Job을 검색해서 초기화`
	- 동시에 `Job을 수행`하도록 구성함
	- Job은 수동 또는 SpringBoot 가 자동으로 실행 시킬 수 있다.

## 스프링 배치 초기화 설정 클래스
### BatchAuthConfiguration
- 스프링 배치가 `초기화` 될 때 `자동으로 실행되는 설정` 클래스
- JobLauncherApplicationRunner 빈 생성 -> 이 빈이 Job 수행
### SimpleBatchConfiguration
- JobBuilderFactory, StepBuilderFactory 생성
- 스프링 배치 `주요 구성 요소`를 `프록시 객체로 생성`함
### BatchConfigurerConfiguration
- BasicBatchConfigurer
	- SimpleBatchConfiguration에서 생성한 프록시 객체의 `실제 대상 객체를 생성`하는 설정 클래스
	- 빈으로 의존성 주입 받기에 `주요 객체들을 참조`해 사용할 수 있음
- JpaBatchConfigurer
	- JPA 관련 객체를 생성하는 설정 클래스 
- `사용자 정의 BatchConfigurer 인터페이스`를 구현해 사용할 수 있음.

## 스프링 배치 실행하기 
### Configuration 
- `@Configuration`으로 `Job`과 `Step`을 `Bean`으로 설정
- JobBuilderFactory
	- Job을 생성하는 빌더 팩토리
- StepBuilderFactory
	- Step을 생성하는 빌더 팩토리

- Job > Step > Tasklet
	- Tasklet은 Step 안에서 `단일 Task로 실행되는 로직`
	- Job 구동 -> Step 실행 -> Tasklet 실행  

## 스프링 배치 실행 흐름도
![[26F109FD-AA89-45F3-BADF-87346FCD3E2E.jpeg]](./2022.01.image/26F109FD-AA89-45F3-BADF-87346FCD3E2E.jpeg)

- Job.start() -> Step 내부의 tasklet() 실행
	- tasklet()이 실제 비지니스 로직 

- Job (일, 일감), Step(일의 항목, 단계), Tasklet(작업 내용)


# DB 스키마 생성
- 스프링 배치 메타 데이터 
	- 스프링 배치 `여러 도메인 (Job 등의) 정보`를 저장, 업데이트, 조회할 수 있는 스키마가 존재함. 
	- DB와 연동한다면 메타 테이블 생성 필수

- 수동 생성 또는 `spring.batch.jdbc.initialize-schema` 설정으로 자동 생성 가능


![[6ED0FC75-4A7E-472E-BF30-AD7F0E5E127B.jpeg]](./2022.01.image/6ED0FC75-4A7E-472E-BF30-AD7F0E5E127B.jpeg)


## Job 관련 테이블
- BATCH_JOB_INSTANCE
	- Job 실행시 `JobInstance` 정보가 저장됨
	- `job_name`, `job_key`로 하나의 데이터만 저장됨 (중복 저장 불가)
- BATCH_JOB_EXECUTION
	- `job의 실행정보` 저장, Job 생성시간, 종료시간, 실행상태, 메세지 등 관리
		- END_TIME이 null이면 중도 중단된 Case
- BATCH_JOB_EXECUTION_PARAMS
	- Job과 함께 실행되는 `JobParameter 정보` 저장
- BATCH_JOB_EXECUTION_CONTEXT
-> Excution마다 생성된다.
	- Job 실행동안 여러가지 상태정보, 공유데이터를 직렬화 해서 저장
	- `Step간 서로 공유 가능`(프로세스 안 스레드간 Context 공유와 비슷한 느낌인듯)

## Step 관련 테이블
- BATCH_STEP_EXECUTION
	- `Step의 실행정보 저장`, 생성, 시작, 종료시간, 실행상태, 메세지 등을 관리함.
	- `Step간 서로 공유 가능`함 (Step은 Step 끼리 공유가 된다)
	- Step이 실행하는 동안 Excution Context가 저장된다 ?? 
- BATCH_STEP_EXECUTION_CONTEXT
	- Step의 실행동안 여러가지 상태정보, 공유 데이터 등을 직렬화 해서 저장
	- Step 별로 저장되고 `Step간 공유할 수 없음` (Step에 대한 정보라 그러한 듯)


-> 테이블이 정확히 어떻게 쓰이는지는 뒤에서 좀 더 봐야 자세히 알 수 있을듯.
