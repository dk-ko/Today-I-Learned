
Q 비 동기적 실행은 어떤 케이스가 있을까?
-> 응답을 받은 후 이후 처리가 필요한 경우는 동기 처리가 적당
그게 아니라면 비동기도 괜찮을 것 같다 

---
# 배치 초기화 설정

## JobLauncherApplicationRunner
- Spring Batch 작업을 시작하는 ApplicationRunner
	- Job은 Bean으로 등록되어 Runner에 전달됨
- BatchAutoConfiguration에서 생성됨
- 기본적으로 Bean으로 등록된 모든 Job을 실행함

## BatchProperties
- Spring Batch의 환경설정 클래스
- Job 이름, 스키마 초기화 설정, 테이블 Prefix 등 설정 가능
- application.yml 등에 설정 가능


## Job 실행 옵션
- 지정한 Batch Job만 실행 가능
- 외부 파라미터로 전달해 실행 하도록 구성 가능
	- 어플리케이션 실행시 Program Arguments로 Job 이름 입력
		- `--job.name=helloJob`
			- 하나 이상의 Job 실행시 쉼표로 구분해 입력