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
5:24~
- docker-compose run {service} {command}
- docker-compose down [service] = stop + kill

