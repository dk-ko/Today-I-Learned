## JobExecution
- JobInstance에 대해 한번 시도를 의미하는 객체로, 실행될 때마다 생성된다.
	- JobInstance는 JobParameter가 동일할 때 오로지 1번 실행됨
- 시작시간, 종료시간, 상태(시작된, 완료, 실패), 종료상태 속성을 가진다.

- JobInstance와 관계
	- COMPLETED : JE가 COMPLETED면 JI는 실행 완료된 것을 재실행이 불가능함
	- FAILED : JI 실행이 완료되지 않음. 재실행이 가능함

- JobExcution이 COMPLETED가 될 때 까지 하나의 JI에서 여러번의 시도가 있을 수 있음

- BATCH_JOB_EXECUTION : JobInstance, JobExecution이 1:M으로 매핑되어 있음.
	- JobInstance에 대한 성공/실패 내역이 존재 

![[IMG_4315.jpg]](./2022.02.image/IMG_4315.jpg)  

![[IMG_4316.jpg]](./2022.02.image/IMG_4316.jpg)  

![[IMG_B55CE2F830D6-1.jpeg]](./2022.02.image/IMG_B55CE2F830D6-1.jpeg)


## Step
- Batch Job을 구성하는 독립된 하나의 단계
	- 실제 배치 처리에 대해  필요한 모든 정보를 갖고 있음
	- Step간 데이터 공유가 불가한 독립적 단계
- Job의 세부 작업을 Task 기반으로 설정해 명세한 객체
	- Job : 가장 큰 명세서, 구현할 내용이 있지 X
	- Step : Job에 대한 구체적인 내용 (비지니스 로직)
- 모든 Job은 하나 이상의 Step으로 구성

### 기본 구현체
- TaskletStep : Tasklet 타입의 구현체 제어
- JobStep : Step 내에서 Job 실행 가능하도록 함 
	- Job > Step이지만 Step 안에서 Job 구현이 가능
	- J -> S -> J -> S 식의 체이닝 구성 가능

## Step 도메인 이해

![[IMG_4319.jpg]](./2022.02.image/IMG_4319.jpg)


![[IMG_4318.jpg]](./2022.02.image/IMG_4318.jpg)

