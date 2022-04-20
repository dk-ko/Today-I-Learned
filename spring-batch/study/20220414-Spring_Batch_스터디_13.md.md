# TaskletStep
## Architecture
- Job -> Step -> RepeatTemplate(반복) -> { Tasklet -> Businnes Logic -> exception -> (반복문 종료 후 Step도 종료)}
- Job -> Step -> RepeatTemplate(반복) -> { Tasklet -> Businnes Logic -> exception X -> RepateStatue 값 FINISHED (반복문 종료 후 Step도 종료)}
- Job -> Step -> RepeatTemplate(반복) -> { Tasklet -> Businnes Logic -> exception X -> RepateStatue 값 CONTINUABLE (반복문 종료 안하고 Tasklet 반복)}


## 호출 흐름
- Job -> TaskletStep
	- StepExection -> ExecutionContext 생성 후 전달 
	- BatchStatus.STARTED, ExitStatus.EXECUTING

- TaskletStep -> RepeatTemplate
	- ~Listener.beforeStep() 
		- 스탭 실행 전 StepExecutionListener

- RepeatTeplate -> Tasklet
	- RepeatStatus.CONTINUABLE


- Tasklet -> RepeatTemplate
	- RepeatStatus.FINISHED(null도 포함)


- RepeatTemplate -> TaskletStep
	- StepListener.afterStep() 호출
	- StepExecution 
		- ExitStatus.COMPLETED
		- BatchStatus.COMPLETED
			- 일반적으로 두 status는 쌍으로 값을 가져간다. 
		- StepExecutionListener 호출 후 추가적인 exitStatus 상태 업데이트 가능

# JobStep
- Step이 또 다른 Job을 포함하고 있는 것
- Step이 실행될 때 Job이 실행됨
- 외부 Job이 실패하면 해당 Step이 실패해서 기존의 Job도 실패함
- 모든 메타데이터는 내부 외부 Job 각각 저장된다.
- 작은 모듈로 쪼개고 싶을 때, Job의 흐름을 관리하고 싶을 때 사용.



- DefaultJobParametersExtractor 는 ExecuteContext 내의 key 값과 일치하면 값을 가져온다. 
- .listener(new StepExecutionLister().beforeStep)에서 stepExecution을 직접 넣어줄 수 있다
	- stepExecution.getExecutionContext().putString("name", "user1");

