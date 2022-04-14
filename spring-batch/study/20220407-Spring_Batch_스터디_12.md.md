# TaskletStep - 개념
- Spring Batch가 제공하는 Step 구현체 중 기본
- Tasklet을 실행시키는 Step
- RepeatTemplate을 사용해서 트랜잭션 경계 내에서 반복해 실행함.
	- TaskletStep -(RepeatTemplate이 반복 시킴)-> Tasklet을 실행
	- RepeatStatus : finish, complete 상태에 따라 달라짐.
- Task 기반, Chunk 기반으로 나눠서 Tasklet을 실행

## Task vs Chunk 기반
- chunk 기반
	- 하나의 큰 덩어리를 나눠서 실행하는 것
	- 대량 처리에 유리
	- ChunkOrientedTasklet 구현체가 제공된다.
- Task 기반
	- 단일 작업 기반이 더 유리
	- Tasklet 구현체
	- 대량 처리에 유리하지 않다. (안되는건 아님)

### Task 기반 흐름
- Job -> TaskletStep -> RepeatTemplate -> (Loop, Transaction) { Tasklet -> Business Logic }

### Chunk 기반
- Job -> TaskletStep -> RepeatTemplate -> (Loop, Transaction) { ChunkOrientedTasklet -> ItemReader, ItemProcessor, ItemWriter }

## API
```java
public Step batchStep() {
	return stepBuilderFactory.get("batchStep")
	.tasklet(Tasklet)
	.startLimit(10)
	.allowStartIfComplete(true)
	.listener(StepExecutionListener)
	.build();
}
```
- startLimit()
	- Step 실행 횟수 설정 , default는 INTEGER.MAX_VALUE
- alloStartIfComplete(true)
	- 실패 또는 한번도 실행하지 않은 Step만 실행하지만, 성공 실패 유무와 관계 없이 실행한다.
- listener(StepExecutionListener)
	- 특정 시점에 콜백을 제공받도록 함

# TaskletStep - tasklet()
- Job 정의 -> Step 정의 -> Tasklet API 설정
- Tasklet은 interface, 직접 구현 또는 익명 클래스의 Tasklet을 설정 가능
- Step 내에서 구성됨.
	- Step이 Tasklet을 실행하는 구성
- 단일 테스크를 수행하기 위한 것
	- 비지니스 로직을 구현
- TaskletStep에 의해 반복적으로 수행됨
- RepeatStatus의 값에 따라 반복 여부를 결정함
	- FINISHED(null 반환해도 이걸로 해석됨), CONTINUABLE
	- RepeatStatus.FINISHED or 실패 예외가 던져지기 전까지 무한히 돌기 때문에 무한 루프를 주의해야함. 
- execute() 메소드 내에서 비지니스 로직 구현 

# TasklepStep - startLimit() / allowStartIfComplete()

### startLimit()
- Step의 실행 횟수 조정
- Step마다 설정 가능 
- default 값은 Integer.MAX_VALUE


### allowStartIfComplete()
- 재시작 가능한 Job의 이전 성공 여부와 상관없이 항상 Step을 실행하기 위한 설정
	- Job 성공 -> 재시작 불가
	- Job 실패 -> 재시작 가능
	- Step 성공 -> 재시작 불가
	- Step 실패 -> 재시작 가능
- 항상 실행하고 싶으면 해당 API를 사용함. 
	- ex) 유효성 검증, 사전작업용 Step 등

