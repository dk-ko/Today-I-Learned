## JobInstance
- Job이 실행될 때 생성되는 `Job의 논리적 실행 단위`
	- `고유하게 식별 가능`해야함
- Job 설정과 구성은 동일해도 Job이 실행되는 시점에 처리하는 내용이 다름
	- 따라서 Job의 실행을 구분해야함
		- ex) 하루 1번 실행되는 Batch Job -> Job은 같지만 매일 각각의 JobInstance가 다름

- JobInstance 생성 및 실행
	- 처음 실행시 Job + JobParameter -> 새로운 JobInstance 생성
	- 이전과 동일한 Job + JobParameter 인 경우 
		- 결과적으로 실패함 
		- 내부적으로 JobParameter인 Job Name + Job Key의 해시값으로 Job Instance를 얻음
		- 따라서 Job + JobParameter가 고유하게 식별 가능해야함 

- Job과 `1:N` 관계

- BATCH_JOB_INSTANCE 테이블과 매핑되며 Job Name과 Job Key가 동일한 데이터는 `중복해서 저장할 수 없음`


### JobInstance 구조
![[IMG_4303.png]](./2022.01.image/IMG_4303.png)


![[IMG_624FAF3D87D9-1.jpeg]](./2022.01.image/IMG_624FAF3D87D9-1.jpeg)

### 실습
- Job과 JobParamater가 같은 경우, 다른 경우를 테스트 
- Spring Boot는 `JobLauncher.run()`을 내부에서 실행
- 실습을 하기 위해서 수동으로 직접 실행해야함

## JobParameter
- JobLauncher가 `Job을 실행`할 때 함께 `포함되어 실행되는 파라미터 객체`
	- Key, Value로 이루어짐
- 하나의 Job에 존재하는 `여러 JobInstance를 구분`하기 위한 용도
- JobParameter와 JobInstance는 `1:1` 관계 
- BATCH_JOB_EXECUTION_PARAM 테이블과 매핑되며, JOB_EXECUTION과 1:N 관계 

### 생성 및 바인딩
1) 어플리케이션 `실행 시 주입`
	- ex) Java -jar XXXBatch.jar requestDate=20210101
2) `코드로 생성`
	- JobParamterBuilder, DafaultJobParametersConverter 이용
3) SpEL 이용
	- 뒤 ch에서 좀 더 자세히 ... 

### JobParameter 구조 
![[IMG_4305.jpg]](./2022.01.image/IMG_4305.jpg)

	