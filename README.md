
# 📅 Event Manager — Gerenciador de Eventos
Projeto fullstack desenvolvido como parte do Desafio de Residência 2025. A aplicação permite que administradores cadastrem, visualizem, editem e excluam eventos, com autenticação JWT e interfaces Web (React) e Mobile (React Native / Expo).

## Estrutura do Repositório
```text
event-manager/
├── event-manager-back/    # Backend Spring Boot
├── event-manager-front/   # Frontend React (Web)
└── event-manager-mobile/  # Mobile React Native (Expo)
````
## Tecnologias Utilizadas 
Backend 
```
Java 17+
Spring Boot
Spring Security + JWT
Spring Data JPA
Banco de dados H2 (em memória)
Springdoc OpenAPI (Swagger UI)
Lombok
BCrypt (criptografia de senhas)
```
Frontend (Web)
```
React
Vite
JavaScript
Fetch API
CSS customizado (Google Fonts: Syne + DM Sans)
````
Mobile
````
React Native
Expo / Expo Router
AsyncStorage
TypeScript
````

## Configuração e Execução
````
Pré-requisitos

Java 17 ou superior
Maven
Expo CLI (npm install -g expo-cli)

## Backend

Navegue até a pasta do backend:

bash   cd event-manager-back/event-manager

Execute a aplicação:

bash   ./mvnw spring-boot:run
Ou, no Windows:
bash   mvnw.cmd spring-boot:run

O servidor iniciará em: http://localhost:8080
Acesse o console do H2 em: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:event_db
Username: sa
Password: (deixe em branco)


Acesse a documentação Swagger UI em: http://localhost:8080/swagger-ui/index.html


⚠️ O banco H2 é em memória — os dados são resetados a cada reinicialização da aplicação.


Frontend (Web)

Navegue até a pasta do frontend:

bash   cd event-manager-front/frontend

Instale as dependências:

bash   npm install

Inicie o servidor de desenvolvimento:

bash   npm run dev

Acesse em: http://localhost:5173


A URL base da API está configurada em src/services/api.js como http://localhost:8080. Altere caso necessário.


Mobile (Expo)

Navegue até a pasta mobile:

bash   cd event-manager-mobile

Instale as dependências:

bash   npm install

Inicie o Expo:

bash   npx expo start

Escaneie o QR code com o app Expo Go (Android/iOS).

A URL base da API está configurada como http://192.168.0.4:8080. Atualize para o IP da sua máquina na rede local antes de usar no dispositivo físico.
````
Endpoints da API
````
Autenticação (/api/auth) — público
MétodoEndpointDescriçãoPOST/api/auth/registerCadastro de novo administradorPOST/api/auth/loginLogin e geração de token JWT
Eventos (/api/events) — requer JWT
MétodoEndpointDescriçãoGET/api/eventsLista eventos do admin autenticadoPOST/api/eventsCadastra novo eventoPUT/api/events/{id}Atualiza data e localizaçãoDELETE/api/events/{id}Exclui um evento
Exemplos de payload
Cadastro de administrador:
json{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
Login:
json{
  "email": "joao@email.com",
  "password": "senha123"
}
Criar/Atualizar evento:
json{
  "title": "Conferência Tech 2025",
  "date": "2025-10-15",
  "location": "São Paulo, SP",
  "imageUrl": "https://exemplo.com/imagem.jpg"
}

Para endpoints protegidos, envie o header: Authorization: Bearer <token>

Telas da Aplicação
Web / Mobile

Login — Autenticação com email e senha. Opção de salvar senha para acesso rápido.
Cadastro — Registro de administrador com validação de confirmação de senha.
Home (Eventos) — Lista de eventos com imagem, título, data e localização. Opções de editar e excluir.
Modal de Evento — Formulário para adicionar novo evento (nome, data, localização e imagem).

Segurança

Senhas armazenadas com BCrypt.
Autenticação via JWT (JSON Web Token) — stateless.
Endpoints públicos: /api/auth/**, /swagger-ui/**, /v3/api-docs/**, /h2-console/**.
Todos os demais endpoints exigem token válido no header Authorization.
CORS configurado para aceitar requisições de localhost:5173, localhost:3000 e o IP local 192.168.0.4.
````

Observações
````
O projeto utiliza banco H2 em memória. Para persistência de dados entre sessões, configure um banco como PostgreSQL ou MySQL no application.properties.
A imagem do evento é armazenada como URL (string). O upload de arquivos não está implementado nesta versão.
O token JWT retornado no login deve ser armazenado no cliente (sessionStorage na web, AsyncStorage no mobile) e enviado em todas as requisições autenticadas.
````
Licença
Este projeto foi desenvolvido para fins educacionais como parte do processo seletivo da Residência de Software 2025.
''' 
