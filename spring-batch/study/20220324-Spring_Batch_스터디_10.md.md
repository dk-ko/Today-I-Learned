# SimpleJob
## 개념 및 API
- SimpleJobBuilder에 의해 생성되는 Job 구현체
- 여러 단계 Step으로 구성되고, 순차적으로 실행
- 마지막에 실행한 Step의 BatchStatus가 Job의 최종 BatchStatus가 됨.
	- 즉 모든 Step이 성공해야함.

```java
public Job batchJob(){
	return jobBuilderFactory.get("batchJob")
		.start(Step)
		.next(Step)
		.incrementer(JobParametersIncrementer) // Job 실행할 때마다 Job Parameter를 증가 시킴, 재실행 가능하도록 함.
	.preventRestart(true)
	.validator(JobParameterValidator)
	.listener(JobExecutionListener)
	.build(); 
}
```

# start() / next()
## .start(Step)
- 처음 실행 할 Step 설정
- 최초 한번만 설정
- SimpleJobBuilder가 생성되고 반환됨.

## .next() 
- 다음에 실행할 Step들을 순차적으로 연결하도록 설정함
- 개수 제한이 없고 여러번 설정이 가능
- 모든 next()의 Step이 종료되면 Job이 종료된다.

# validator()
- Job 실행에 필요한 파라미터 `JobParameter`를 검증하는 용도
- `DefaultJobParametersValidator` 구현체를 지원
- 인터페이스를 직접 구현해 커스텀 제약 조건 생성 가능
- JobParamete를 매개 변수로 받아 검증함
```java
JobParametersValidator
	|
void validate(@Nullable JobParameters parameters)
```
- JobParameter는 Key / Value 구조인데 설정된 필수 Key 값이없는 경우 Exception

# preventRestart()
- Job의 `재시작` 여부 설정
- Default value는 true
- false시 JobRestartException 발생
- Job 최초 실행과는 무관함
- Job 최초 실행이 아닌 경우 Job의 성공/실패와 무관하게 이 값에 의해서만 재시작이 결정된다
	- Q. 근데 성공해도 재시작 안하지 않나..?