# MindDrain — Guia do Projeto

Este repositório contém o app MindDrain — uma aplicação feita com Expo/React Native para simular e visualizar o tempo de uso em redes sociais, com um assistente IA que gera gráficos e insights.

## Visão geral

- Frontend: Expo + React Native + TypeScript
- Roteamento: `expo-router` (file-based routing)
- Backend: Node.js + Express + MongoDB (Mongoose)
- Persistência local: `@react-native-async-storage/async-storage`
- Gráficos: `react-native-pie-chart`, `react-native-chart-kit`
- IA: integração com modelo generativo (arquivo `src/screens/tabs/ia/ia.tsx` contém a chamada de exemplo ao Gemini API)

## Principais funcionalidades

- Cadastro e login de usuário (backend em `server/`). Validação de senha no frontend exige letras, números e caracteres especiais.
- Opção `Lembrar de mim` no login (persistida em AsyncStorage) que restaura a sessão automaticamente.
- Assistente IA para registrar/estimular tempos de uso por app a partir de frases do usuário (ex: "1h 20min no Instagram").
- Tela de gráficos (pie) que mostra distribuição por apps, cards de insight gerados pela IA e opção de limpar histórico.
- Tela de configurações com limite diário, notificações e opção para sair da conta (logout limpa sessão persistida).

## Tecnologias e dependências (resumo)

- Expo (SDK): Mobile + web
- React / React Native
- TypeScript
- expo-router
- @react-native-async-storage/async-storage
- react-native-pie-chart, react-native-chart-kit
- Node.js + Express (server)
- MongoDB Atlas / Mongoose
- bcryptjs, jsonwebtoken

## Pré-requisitos

- Node.js (16+ recomendado)
- npm ou yarn
- Expo CLI (opcional, `npm i -g expo-cli`)
- Para rodar o backend: uma instância MongoDB (ex.: MongoDB Atlas) e variáveis de ambiente configuradas

## Como clonar e executar localmente

1. Clone o repositório:

```bash
git clone https://github.com/VictoRossiPereira/ExpoTech-MindDrain.git
```

2. Instale dependências do frontend:

```bash
npm install
```

3. Instale dependências do backend e configure variáveis de ambiente:

```bash
cd server
npm install
```

Crie um arquivo `.env` dentro da pasta `server/` com (exemplo):

```
MONGO_URI=<sua_mongo_connection_string>
JWT_SECRET=uma_chave_segura_aqui
PORT=5000
```

4. Inicie o backend:

```bash
cd server
npm start
```

5. Inicie o frontend (volte à raiz do projeto):

```bash
cd ..
npx expo start
```

Abra no emulador Android/iOS, Expo Go ou web conforme a saída do Expo.

## Configurar a chave IA (opcional)

O arquivo `src/screens/tabs/ia/ia.tsx` contém um placeholder com a chave do serviço generativo (variável `GEMINI_API_KEY`). Para produção, prefira armazenar a chave em variáveis de ambiente e não no código-fonte.

## Estrutura do projeto (resumida)

- `app/` — rotas e telas usadas pelo Expo (login, register, tabs, etc.)
- `src/screens/tabs/ia/` — componente da IA e lógica de extração de tempo
- `src/screens/tabs/pie/` — tela de gráficos e insights
- `src/store/ia-store.ts` — store local e persistência
- `server/` — backend Express, rotas de `/api/register`, `/api/login`, `/api/user`

## Notas de desenvolvimento

- A validação de senha foi implementada no frontend: exige pelo menos uma letra, um número e um caractere especial.
- O comportamento de "Lembrar de mim" persiste uma sessão simples em AsyncStorage (`@minddrain_session`) e restaura automaticamente ao abrir o app.
- Logout a partir da tela de configurações remove a sessão e reseta os dados locais.

## Dicas e troubleshooting

- Se o app mobile não conectar ao backend ao rodar em emulador físico, use o IP da sua máquina no lugar de `localhost` (o código já aponta para `10.0.2.2` quando detecta Android/emulador).
- Se ocorrerem problemas com bibliotecas nativas, rode `npx expo doctor` e siga as instruções do Expo.

## Como contribuir

- Faça fork, crie uma branch, implemente suas mudanças e abra um pull request. Documente alterações relevantes no README.

## Licença

- Projeto de exemplo (sem licença específica definida). Adicione uma licença se desejar compartilhar publicamente.

---

Se quiser, eu posso:
- Gerar um `.env.example` para o backend;
- Mover a chave da IA para variáveis de ambiente;
- Adicionar instruções para rodar em modo production ou contêiner.


