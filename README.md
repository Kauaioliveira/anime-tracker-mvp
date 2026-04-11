# Anime Tracker

Aplicacao web desenvolvida com React, TypeScript e Vite para buscar animes, visualizar detalhes e organizar listas pessoais como favoritos, assistidos e planejados.

## Preview

![Anime Tracker preview](./public/Captura%20de%20tela%202026-04-11%20153246.png)

## Funcionalidades

- Busca de animes por titulo
- Busca por estudio
- Busca por ano
- Listagem de destaques
- Paginacao de resultados
- Pagina de detalhes do anime
- Lista de favoritos
- Lista de assistidos
- Lista de planejados
- Persistencia local com `localStorage`
- Estados de loading com skeleton
- Tratamento de erros de requisicao

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- React Router
- Context API
- CSS
- Jikan API

## Objetivo Do Projeto

Este projeto foi desenvolvido com foco em praticar conceitos de front-end moderno, incluindo componentizacao, tipagem com TypeScript, consumo de API externa, gerenciamento de estado e organizacao de codigo em uma aplicacao realista de nivel inicial.

## Aprendizados

Durante o desenvolvimento deste projeto, pratiquei:

- consumo de API REST com tratamento de erro
- criacao de interfaces reutilizaveis com React
- gerenciamento de estado global com Context API
- persistencia de dados no navegador com `localStorage`
- organizacao de codigo por paginas, componentes, hooks, contexto e tipos
- boas praticas basicas de UX, como feedback visual de carregamento e estados vazios

## Estrutura Do Projeto

```text
src/
  components/
  config/
  context/
  hooks/
  layout/
  lib/
  pages/
  types/
```

## Como Rodar Localmente

```bash
npm install
npm run dev
```

Para gerar build de producao:

```bash
npm run build
```

Para validar tipagem:

```bash
npm run typecheck
```

Para rodar lint:

```bash
npm run lint
```

## Proximos Passos

- adicionar testes
- melhorar acessibilidade
- adicionar filtros mais avancados
- permitir remover itens diretamente das listas salvas
- melhorar a documentacao visual do projeto

## API Utilizada

Este projeto utiliza a [Jikan API](https://docs.api.jikan.moe/), uma API publica baseada em MyAnimeList.
