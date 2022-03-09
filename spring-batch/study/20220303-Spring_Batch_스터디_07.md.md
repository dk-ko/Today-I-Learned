## JobLauncher
- **배치 Job을 실행시키는 역할**
- `Job, Job Parameter`를 인자로 받아 배치를 수행한 뒤 `JobExecution`을 반환
	- JobLauncher.run
		- JobExecution run(Job, JobParameters);
- SpringBoot Batch가 구동시 JobLauncher Bean이 자동 생성됨


- Job 실행
	- Batch 실행시 `BatchAutoConfiguration` 이 `JobApplicationRunner Bean` 생성
	- SpringBoot Batch에서 `JobLauncherApplicationRunner`가 자동으로 JobLauncher를 실행
		- spring.batch.job.enabled = false 시 자동 실행 X
	- 최종적으로 `JobLauncher.execute` 에서 `run`을 실행함

	- 동기적 실행
		- Launcher의 `taskExecutor = SyncTaskExecutor (Default)`
		- JobExecution 획득 -> 배치 처리 최종 완료 -> Client에게 JobExecution 반환 (JobExecution.ExitStatus.FINISHED or FAILE)
		- 스케쥴러를 이용한 배치 처리에 적합 (배치 시간이 길어도 상관 없는 경우)
	- 비동기적 실행 
		- Launcher의 `taskExecutor = AsyncTaskExecutor`로 설정하는 경우
			- Async 설정을 위해 `JobLauncher Bean`이 아닌, `BatchAutoConfiguration`을 직접 주입 받아야함. 
			- SpringBatch 는 기본적으로 `Proxy 객체`를 만든 뒤 `실제 객체`를 찾아가는 방식
				- SpringBatch의 실행에 관한 부분은 횡단 관심사로 Spring AOP가 적용되는 것으로 보임.
					- Spring은 기본적으로 CGLIB 방식으로 Proxy 생성함. 
				- 횡단 관심 객체와 핵심 관심 객체를 느슨하게 연결하기 위해 Proxy객체를 통해 동적으로 참조한다. 
				- 참고 : [JDK Dynamic Proxy와 CGLIB의 차이점은 무엇일까?](https://gmoon92.github.io/spring/aop/2019/04/20/jdk-dynamic-proxy-and-cglib.html), [AOP : Aspect Oriented Programming 개념](https://gmoon92.github.io/spring/aop/2019/01/15/aspect-oriented-programming-concept.html)
			- `JobLauncher를 주입`받는 경우 `Proxy 객체`라 SimpleJobLauncher로 `타입 캐스팅` 할 수 없음
			- 따라서, 실제 JobLauncher를 갖고 있는 `BatchAutoConfiguration`을 주입받아 JobLauncher 를 꺼내 (configuration.getJobLauncher) SimpleJobLauncher로 `타입 캐스팅`함
			- SimpleJobLauncher에 있는 `setTaskExecutor` 메소드로 설정
		- JobExecution 획득 -> Client에게 JobExecution 반환 (JobExecution.ExitStatus.UNKNOWN) -> 배치 처리 완료
		- HTTP 요청에 의한 배치처리에 적합 (배치 처리 시간이 길 경우 응답이 늦어지지 않음)
			- Q. 어떤 Case가 있을까..?
