- docker-compose pull [service]
: 필요한 이미지 다운로드
- docker-compose build [service]
: 필요한 이미지를 빌드한다 
- docker-compose up [service]
: 서비스 구동
    - `--build`: 강제로 이미지를 다시 빌드
    - `--force-recreate`: 컨테이너를 새로 생성
    - `-d`: 데몬 모드로 실행
- docker-compose ps
: 실행중인 서비스 목록 
     : directory_service_number 이름 규칙으로 생성됨
- docker-compose logs [service]
    - `-f`: 로그 계속 보기 
- docker-compose top [service]
    - 서비스 내에서 실행중인 프로세스 목록을 보여줌
- docker-compose stop [service]
    - 실행중인 서비스 멈춤
    - 멈춤 뒤 재실행시 `up` 대신 `start` 사용 가능 
- docker-compose exec {container} {command}
    - 컨테이너 안에서 명령어 실행할 때
        - `-e`: 환경변수 설정
- docker-compose run {service} {command}
    - 해당 서비스에 컨테이더를 하나 더 실행한다.
        - `-e`: 환경변수 설정
        - `-p`: 연결할 포트를 설정
        - `--rm`: 컨테이너 종료시 자동 삭제 
- docker-compose down [service] = stop + kill
    - 서비스를 멈추고 컨테이너를 삭제
        - `-v`: 도커 볼륨도 함께 삭제 

