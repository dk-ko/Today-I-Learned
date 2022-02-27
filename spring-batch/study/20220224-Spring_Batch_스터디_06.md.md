## ExecutionContext
- `프레임 워크`에서 유지 및 관리하는 Map으로 된 컬렉션(ConcurrentHashMap), StepExecution 또는 JobExecution `객체의 State`를 저장하는 `공유 객체`
- DB에 직렬화 한 값으로 저장됨 - {key : value}
- 공유 범위
	- Step 범위 : 각 Step의 StepExecution에 저장되며 Step간 공유 안됨
	- Job 범위 : 각 Job의 JobExecution에 저장되며 Job간 서로 공유 안됨, **해당 Job의 Step간 서로 공유됨.**
- Job 재 시작시 `이미 처리한 Row 데이터를 건너뛰고 이후로 수행하도록 할 때` 상태 정보를 활용함 

- BATCH_JOB_EXECUTION_CONTEXT
	- Job에 대한 inputCount, date 정보 
- BATCH_STEP_EXECUTION_CONTEXT
	- Tasklet, Step에 대한 정보, batch.taskletType, name, batch.stepType
-> Batch 재시작 등에 필요한 데이터를 담고 있음

![[IMG_4344.jpg]](./2022.02.image/IMG_4344.jpg)

## JobRepository
- 배치 작업 중의 정보를 저장하는 저장소
- Job의 수행 시간, 끝난 시간, 실행 횟수, 실행 결과 등의 모든 meta data를 저장
	- **JobLauncher, Job, Step 구현체 내부에서 CRUD 기능 처리**

![[IMG_4345.jpg]](./2022.02.image/IMG_4345.jpg)


- JobRepositoey 설정
	- @EnableBatchProcessing 어노테이션 선언시 JobRepository가 자동으로 빈으로 생성
	- BatchConfigurer, BasicBatchConfigurer 상속해 JobRepository 설정을 커스텀할 수 있다.
		- JDBC 방식 설정 - JobRepositoryFactoryBean
			- 내부적으로 Aop 이용한 Transaction 처리 해줌
			- 트랜잭션의 Isolation의 디폴트가 SERIALIZEBLE로 최고로 엄격함. 변경 가능
			- 메타 테이블의 Table Prefix 변경 가능 (디폴트 "BATCH_")
		- In Memory 방식으로 설정 - MapJobRepositoryFactoryBean
			- 성능 등의 이유로 DB에 굳이 저장하고 싶지 않은 경우
			- Test나 프로토타입 개발에 사용됨.

![[IMG_4346.jpg]](./2022.02.image/IMG_4346.jpg)