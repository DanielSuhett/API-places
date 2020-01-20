# Places API

## Stack

* NodeJS - usando Express
* MySQL - usando querys nativas
* AWS S3
* Docker
* Docker-compose

## Funções
* Criar um usuário
* Logar em seu usuário
* Criar um novo lugar
* Listar lugares
* Listar lugar específico
* Pode excluir ou configurar lugares
* Pode votar em um lugar  - *sem necessidade de login*

## Instalação
   ### Dependencias
   * [Docker](https://docs.docker.com/install/)
   * [NodeJS](https://docs.docker.com/install/)
   ### Comandos
 > `git clone https://github.com/DanielSuhett/API-places`

 > `cd API-places`

 > `npm install`

 > `docker-compose up`

## Uso

#### [Client desenvolvido com React Hooks para consumo de todos os endpoints citados](https://github.com/DanielSuhett/Client-places) 
 ### Rotas sem autenticação
  #### Cadastro de usuário
   > Metodo: **POST** 
   >> URL: localhost:3001/signup
   >>> payload: username, password, passwordConfirm
  #### Login  
   > Metodo: **POST** 
   >> URL: localhost:3001/signin
   >>> payload: username, password.
   >>>> **Essa rota retornará o token x-access-token para adicionar às requisições que precisam.**
   
  #### Exibir lugares para votar  
   > Metodo: **GET** 
   >> URL: localhost:3001/vote/**:id** 
   >>> parâmetro: chave primária(_id) do usuário de criou os lugares.
   >>>> Essa rota retorna uma instância de votação para os lugares do usuário que criou.
   
  #### Enviar voto
   > Metodo: **PUT** 
   >> URL: localhost:3001/vote/**:id** 
   >>> parâmetro: chave primária(_id) do lugar.
   >>>> Essa rota somará +1 aos votos do lugar passado como parâmetro
 

### Rotas com autenticação
  > **Todas as rotas aqui precisam de um token válido no header x-access-token**

  #### Cadastro de lugar
   > Metodo: **POST** 
   >> URL: localhost:3001/places/create
   >>> payload **MULTI-FORM**: place_name, file

  #### Listar todos os lugares
   > Metodo: **GET** 
   >> URL: localhost:3001/places

  #### Lista um lugar específico
   > Metodo: **GET** 
   >> URL: localhost:3001/places/**:id**
   >>> parâmetro: chave primária(_id) do lugar.

  #### Atualizar um lugar  
   > Metodo: **PUT** 
   >> URL: localhost:3001/vote/**:id** 
   >>> payload **MULTI-FORM**: place_name, file
   >>>> parâmetro: chave primária(_id) do lugar.

  #### Deletar um lugar  
   > Metodo: **PUT** 
   >> URL: localhost:3001/vote/**:id** 
   >>> payload **MULTI-FORM**: place_name, file
   >>>> parâmetro: chave primária(_id) do lugar.
 


## License

[MIT](https://choosealicense.com/licenses/mit/)
