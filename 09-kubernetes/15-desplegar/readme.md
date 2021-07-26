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
eksctl create cluster --name cluster-curso --without-nodegroup --region us-east-2 --zones us-east-2a,us-east-2b
```

### Agregar nodos

```
eksctl create nodegroup --cluster cluster-curso --name cluster-curso-workers --version auto --node-type t3.medium --nodes 1 --nodes-min 1 --nodes-max 3 --asg-access
``
```

### Crear IAM Provider

```
eksctl utils associate-iam-oidc-provider --cluster cluster-curso --approve
```

### Descarga política para el cluster

```
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.1.2/docs/install/iam_policy.json
```

### Crear la política

```
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
```

### Crear la cuenta ServiceAccount para el cluster

```
  eksctl create iamserviceaccount --cluster=cluster-curso --namespace=kube-system  --name=aws-load-balancer-controller --attach-policy-arn=arn:aws:iam::<ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --approve
```

### Verificar si existe el controlador ingress del balanceador

```
kubectl get deployment -n kube-system alb-ingress-controller
```

> _Se espera que no exista el controlador_

### Instalar el TargetGroupBinding

```
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"
```

### Agregar los repositorios

```
helm repo add eks https://aws.github.io/eks-charts
```

### Actualizar los repositorios

```
helm repo update
```

### Instalación del controlador ingress del balanceador

```
helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller --set clusterName=cluster-curso --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller -n kube-system
```

### Instalar balanceador

```
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller --set clusterName=testing-cluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller3 -n kube-system
```

### Verificar que exista el controlador

```
kubectl get deployment -n kube-system aws-load-balancer-controller
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
docker login -u AWS -p $(aws ecr get-login-password --region us-east-2) <ACCOUNT_ID>.dkr.ecr.us-east-2.amazonaws.com
```

### Subir las imágenes al ECR

```
docker compose -f docker-compose-aws.yaml push
```

### Para desplegar el autoescalado en el cluster

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml
```

### Editar el manifiesto del deployment del autoescalado

```
kubectl -n kube-system edit deployment.apps/cluster-autoscaler
```

Agregar

        - --balance-similar-node-groups
        - --skip-nodes-with-system-pods=false
        - --scale-down-unneeded-time=5m

### Enlaces

- [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
- [Cluster Autoscaler](https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html)
