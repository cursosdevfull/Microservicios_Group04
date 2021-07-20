## Desplegar en AWS

### Herramientas a instalar

- Chocolatey
- aws-cli (https://awscli.amazonaws.com/AWSCLIV2.msi)
- eksctl (choco install -y eksctl)
- helm (choco install kubernetes-helm)

### Configurar usuario

```
aws configure
```

### Crear cluster en AWS

```
eksctl create cluster --name testing-cluster --without-nodegroup --region us-east-2 --zones us-east-2a,us-east-2b
```

### Agregar nodos

```
eksctl create nodegroup --cluster testing-cluster --name testing-workers --version auto --node-type t3.medium --nodes 1 --nodes-min 1 --nodes-max 3 --asg-access
``
```

### Crear IAM Provider

```
eksctl utils associate-iam-oidc-provider --cluster testing-cluster --approve
```

### Descarga política para el cluster

```
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.1.2/docs/install/iam_policy.json
```

### Crear la política

```
aws iam create-policy --policy-name AWSLoadBalancerControllerAdditionalIAMPolicy4 --policy-document file://iam_policy_v1_to_v2_additional.json
```

### Crear la cuenta ServiceAccount para el cluster

```
  eksctl create iamserviceaccount --cluster=testing-cluster --namespace=kube-system  --name=aws-load-balancer-controller3 --attach-policy-arn=arn:aws:iam::282865065290:policy/AWSLoadBalancerControllerIAMPolicy2 --override-existing-serviceaccounts --approve
```

### Instalar balanceador

```
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller --set clusterName=testing-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller3 -n kube-system
```

### Crear las imágenes con los tags de AWS

- Ir al ECR y crear los repositorios para cada una de las imágenes
- Usar las url de los repositorios como tag names de cada uno de las imágenes
  _aplicar en docker-compose-aws.yaml_

```
docker compose -f docker-compose-aws.yaml build
```

### Vincular la cuenta de AWS con la cuenta de Docker local

```
docker login -u AWS -p $(aws ecr get-login-password --region us-east-2) 282865065290.dkr.ecr.us-east-2.amazonaws.com
```

### Subir las imágenes al ECR

```
docker compose -f docker-compose-aws.yaml push
```

kubectl delete -f https://raw.githubusercontent.com/kubernetes-sigs/aws-alb-ingress-controller/v1.1.8/docs/examples/alb-ingress-controller.yaml
kubectl delete -f https://raw.githubusercontent.com/kubernetes-sigs/aws-alb-ingress-controller/v1.1.8/docs/examples/rbac-role.yaml

aws iam create-policy --policy-name AWSLoadBalancerControllerAdditionalIAMPolicy4 --policy-document file://iam_policy_v1_to_v2_additional.json

aws iam attach-role-policy --role-name AWSLoadBalancerControllerAdditionalIAMPolicy --policy-arn arn:aws:iam::282865065290:policy/AWSLoadBalancerControllerAdditionalIAMPolicy4

aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json

eksctl create iamserviceaccount --cluster=testing-cluster --namespace=kube-system --name=aws-load-balancer-controller --attach-policy-arn=arn:aws:iam::282865065290:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --approve

aws iam create-policy --policy-name AWSLoadBalancerControllerAdditionalIAMPolicy --policy-document file://iam_policy_v1_to_v2_additional.json

helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller --set clusterName=testing-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller -n kube-system

aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
