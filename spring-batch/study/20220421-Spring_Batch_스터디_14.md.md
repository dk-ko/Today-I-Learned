- Job, Step은 고정된 순서로 구성 가능
- Flow를 중간에 넣는다면 복잡한 흐름 가능


# FlowJob
## 개념
- Step을 순차적으로뿐 아닌 특정 상태에 따라 흐름 전환하도록 구성하는 것
	- 사용하는 경우
		- Step이 실패해도 Job이 실패하면 안되는 경우
		- Step이 실행된 후 조건에 따라 분기해야하는 경우
		- 특정 Step이 실행되지 않게 구성하는 경우 
		- ...

- Flow와 Job의 흐름만 구성하고 실제 비지니스는 Step 내에서 이루어진다.
- 내부에 SimpleFlow 객체를 갖고 있고 Job 실행 시 호출됨

-> **조건과 흐름에 따른 유연하고 복잡한 구성이 가능하다.**

## SimpleJob과 비교 
- SimpleJob : 순차적 흐름
- FlowJob : 조건에 따라 분기해 실행
	- Step A의 성공 유무에 따라 Step B, C가 실행된다면, A가 성공하든 실패하든 Job은 모두 성공한다.


## API
```java
public Job batchJob() {
	return jobBuilderFactory.get("batchJob")
			.start(Step)
			// Flow 시작하는 Step 설정
			.on(String pattern)
			// Pattern이 종료 상태를 catch
			// TrasitionBuilder 반환
			.to(Step)
			// 다음으로 이동할 Step
			.stop() / fail() / stopAndRestart()
			// Flow를 중지 / 실패 / 종료 
			.from(Step)
			// 이전 단계에서 정의한 Step의 Flow를 추가적으로 정의함(?)
			.next(Step)
			// 다음으로 이동할 Step
			.end()
			// SimpleFlow 객체 생성 
			.build()
			// FlowJob 생성 후 flow 필드에 SimpleFlow 저장 
}
```

- start, from, next -> flow : 흐름 정의
- on, to, stop, fail, end, stopAndRestart -> Transition : 조건에 따라 흐름을 전환함


- FlowBuilder의 on(pattern)을 호출하면 TransitonBuilder가 작동하며 Step을 조건부로 실행할 수 있게 된다.
	- on(pattern) 이후 to(), stop(), fail(), end(), stopAndRestart() 호출 가능
	- 완료 후 return FlowBuilder


# Start() / next()
- start(Flow)
	- 처음 실행할 Flow 설정
	- JobFlowBuilder 반환
	- Step이 인자로 오면 SimpleJobBuilder 반환
	- start 메소드의 인자로 어떤 것이 오냐에 따라 구체화된 하위 빌더가 달라지게 된다.
- next(Step or Flow or JobExecutionDecider)


## Step으로 Job 구성
- Flow와 Step으로 구성하고 on() 메소드를 사용하지 않는다면 Step과 같이 순차적으로 실행된다.
- 다만 Flow 내부에 있는 흐름도 추가로 실행되는 것이 다르다. (Step을 Flow 별로 분리해 구성)
- 따라서 Step 중 하나라도 실패하면 전체 Job이 실패한다.
- on()을 사용해 pattern을 줬을 때 조건과 흐름을 제어할 수 있다.