FROM centos:7

RUN yum upgrade -y && yum update -y

RUN yum install nano httpd -y

COPY ./httpd.conf /etc/httpd/conf/httpd.conf

EXPOSE 90

CMD ["apachectl","-DFOREGROUND"]