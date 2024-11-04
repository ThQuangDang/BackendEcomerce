//CREATE CREATE

CREATE TABLE test_table(
    id int NOT NULL,
    name varchar(255) DEFAULT NULL,
    age int DEFAULT NULL,
    address varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE= InnoDB DEFAULT CHARSET=utf8mb4;

//CREATE PROCEDURE

CREATE DEFINER=`tipjs`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 10000000;
DECLARE 1 INT DEFAULT 1;
WHILE i <= max_id DO
INSERT INTO test_table (id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END

//Dung OPENSSL de tao 2 khoa privatekey, publickey
openssl genrsa -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem

//tao nginx + ec2 với unbutu
### tao keypair tai ec2 tren amazoncloud, r chuyen no den thu muc ssh va tien hanh ket not, install nginx
mv Downloads/server-devshop-key-pair.pem ~/.ssh/   
chmod 400 ~/.ssh/server-devshop-key-pair.pem
ssh -i "~/.ssh/server-devshop-key-pair.pem" ubuntu@ec2-54-151-253-45.ap-southeast-1.compute.amazonaws.com
sudo apt-get update
sudo apt-get install nginx
sudo systemctl status nginx
curl localhost
sudo vim /var/www/html/index.nginx-debian.html

//ec2+ mysql với linux
### hầu hết các gói đều yêu cầu phần phụ thuộc có sẵn trong kho của bên thứ 3 vì vậy chúng ta cần sử dụng linux amazon, để cấu hình kho lưu trữ cần thiết cho việc cài đặt gói 
### giống như server tao keypair tai ec2 tren amazoncloud, r chuyen no den thu muc ssh va tien hanh ket not
mv Downloads/mysql-devshop-node-key-pair.pem ~/.ssh/
chmod 400 ~/.ssh/mysql-devshop-node-key-pair.pem
ssh -i "~/.ssh/mysql-devshop-node-key-pair.pem" ec2-user@ec2-54-151-250-180.ap-southeast-1.compute.amazonaws.com
sudo amazon-linux-extras install epel -y
sudo yum install https://dev.mysql.com/get/mysql80-community-release-el7-5.noarch.rpm
sudo yum install mysql-community-server
###
### nếu xuất hiện lỗi 
Failing package is: mysql-community-client-8.0.36-1.el7.x86_64
GPG Keys are configured as: file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022, file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
### lên trang https://tecadmin.net/install-mysql-8-on-centos/ 
### b1: Cập nhập lại hệ thống
sudo yum update
### b2: Thêm kho lưu trữ mysql
sudo rpm -Uvh https://dev.mysql.com/get/mysql80-community-release-el7-10.noarch.rpm  
### b3: Kích hoạt kho lưu trữ mysql 8.0
sudo yum-config-manager --enable mysql80-community
### b4: Cài đặt máy chủ MySQL
sudo yum install mysql-community-server 
###
sudo systemctl enable mysqld
sudo systemctl start mysqld
sudo systemctl status mysqld
### cách xem mật khẩu root của mysql
sudo cat /var/log/mysqld.log | grep "temporary password"
mysql -uroot -p
### sau khi vào thì sẽ xuất hiện lỗi ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this s
mysql> ALTER USER root@'localhost' IDENTIFIED WITH mysql_native_password BY 'Asdfghjkl;1';

### xem version trong ec2
lsb_release -a
### xem thư mục này nằm ở đâu
pwd

//Copy file sql và cho phép truy cập từ xa bằng ssh
### scp -i ~/.ssh/key.pem ~/Downloads/mysqlsampledatabase.sql ec2-user@ec2-54-151-250-180.ap-southeast-1.compute.amazonaws.com --- đây là ví dụ về lệnh copy file sql từ local lên ssh, scp -i (nơi chứa key) (file cần tải lên) (DNS)
scp -i "~/.ssh/mysql-devshop-node-key-pair.pem" mysqlsampledatabse.sql ec2-user@ec2-54-151-250-180.ap-southeast-1.compute.amazonaws.com
### sau khi copy file thi sử dụng lệnh ssh để vào ec2 và kiểm tra xem có file mysqlsampledatabase.sql hay chưa (sử dụng lênh ls -la) sau đó đăng nhập vào mysql dưới dạng root(cao nhất) ---mysql -uroot -p---- vào tạo người dùng và cấp quyền
### tạo user tipjs đăng nhập vào được bằng localhost
CREATE USER 'tipjs@localhost' IDENTIFIED WITH mysql_native_password BY 'Qwertyuiop[]1';
### cấp quyền cho tipjs (đằng sau ON là têndatabase.cácbảng)
GRANT ALL PRIVILEGES ON shopDEV.* TO 'tipjs@localhost'
### tạo user anonystick sử dụng % để chấp nhận tất cả các ip
CREATE USER 'anonystick'@'%' IDENTIFIED WITH mysql_native_password BY 'Zxcvbnm,.1';
### cấp quyền cho anonystick 
GRANT ALL PRIVILEGES ON *.* TO 'anonystick'@'%'
### vào navicat premium để kết nối bằng ssh hoặc vô mysql workbench

//CI/CD 
### CI/CD là công nghệ công nghiệp hóa (auto tự động hóa tất cả các quy trình mà không có con người tham gia)  
con người tham gia là  chuẩn bị các nguyên vật liệu để bỏ vào 1 cái gì đó để bắt đầu xây dựng 1 quy trình chuẩn , sau khi chúng ta chuẩn bị nguyên liệu xong và bỏ vào nghĩa là CI, (nó sẽ hoạt động và hoạt động xong nó sẽ kiểm tra kiểm thử) và đóng chai là CD
### nói theo cách công nghệ phần mềm
CI tức là nhiều nhà phát triển, nhiều lập trình viên có thể làm việc trên các modurn hoặc là các chức năng khác nhau của cùng 1 ứng dụng cùng 1 lúc, khi chúng ta làm xong , sẽ hợp nhất các thay đổi của code của chúng ta lên cái nhánh chính sau khi được kiểm thử và test
Khi nhánh chính được hợp nhất, thì tự động có 1 quy trình nó detect được, à nhánh chính có sự thay đổi trong code, thì lúc đó ec2 nó sẽ tự động deload code cho chúng ta và tự động restart server và có quy trình chuẩn
### thực hành chi tiết trên folder shopdev-backend-ci-cd và git QuangThaik3/shopdev-api-version-01
### trước tiên loại bỏ git có sẵn (sử dụng unbutu-linux)
rm -rf .git
### tạo lệnh git và up lên git Quangthaik3/shopdev-api-version-01
### đây là tạo lệnh git và mặc định là nhánh master
git init
git remove add origin git@github.com:QuangThaik3/shopdev-api-version-01.git
git status
### đẩy lên git và chuyển qua nhánh main
git branch -M main
git add .
git commit -m "INIT: init project"(git commit ở đây là giống như comment)
git push -u origin main
### vào git nơi chứa project, vào settings, chọn actions->runner, chọn linux, sử dụng lệnh ssh để kết nối tới ec2,và làm theo lệnh trên git để kết nối đến ip máy của mình, nhưng nó sẽ ở chế độ nghỉ ngơi, để khởi động nó chúng ta dùng lệnh sau
### lưu ý: khi làm theo lệnh ở trên git, sẽ có 1 dòng là: Enter name of work folder(for _work), khi mà chúng ta config thì tất cả các dự án sẽ nằm trong file _work
sudo ./svc.sh install 
sudo ./svc.sh start
### đến bước này vẫn chưa có file _work, trong action-runner, để tạo chúng ta vào actions và tìm continuous integration, và tìm nodejs và click vô configure
### trong file config, thì có vài chỗ cần lưu ý, có thể thay đổi name, runs-on: thì vô phần runners, ở setting, bên cạnh ip-172-31-28-181, chữ đầu tiên là labels , lấy nó và thay vào phần runs-on, node-version- chọn version phù hợp, run: npm ci- nó sẽ xóa toàn bộ thư mục của chúng ta tồn tại và install tất cả các mới ở trong file package của mình, sau khi tạo file xong thì sẽ xuất hiện file _work trong action-runner
### vào file _work cài đặt node giống với bản được config, và vào file được lưu trên git để chạy
### https://github.com/nodesource/distributions
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
node -v
npm -v 
npm run dev
### cài đặt pm2 trên unbutu, để xem log và tự khởi động chạy trên ec2
git pull (kéo code .github/workflows trên github về visua code của mình để config trực tiếp trên đó)
sudo npm install pm2@latest -g
pm2 list 
pm2 start server.js --name=shopdev-backend
### tạo lệnh run pm2 trên file config, sử dụng git push vào nhánh main, nó sẽ tự động depoy vào actions, vô ec2,security-group,để edit chấp nhận port ở server.js, sử dụng publicid:port nó sẽ tự động chạy 
- run: pm2 restart shopdev-backend
git add .
git commit -m "FIX: add pm2 to server"
git push
    





