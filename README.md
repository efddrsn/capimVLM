# capimVLM

Protótipo de avaliação odontológica assistida por modelos de visão.

## Visão geral

O projeto oferece duas interfaces web construídas com Flask:

- **Painel principal (`/`)** – recebe o upload de uma foto, envia para o modelo de análise (simulado) e exibe:
  - JSON estruturado com os problemas odontológicos identificados;
  - Galeria "antes e depois" com a foto original e a versão corrigida pelo modelo de geração (simulado).
- **Back-end simplificado (`/backend`)** – painel para editar os prompts das duas chamadas de modelo, além de visualizar a resposta bruta do modelo de análise e a versão estruturada antes de ir para a UI principal.

Os serviços externos (OpenAI Vision e Gemini Nano-Banana) estão stubados para permitir o uso offline. As funções responsáveis estão isoladas em `app/services/vision.py` e `app/services/gemini.py`, facilitando a troca por integrações reais.

## Requisitos

- Python 3.11+
- Dependências listadas em `requirements.txt`

Instale-as com:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Como executar

```bash
export FLASK_APP=app.app
flask run --host 0.0.0.0 --port 5000
```

Acesse `http://localhost:5000` para o painel principal e `http://localhost:5000/backend` para editar os prompts.

Quando rodar em produção (por exemplo em plataformas que injetam a variável `PORT`), o entrypoint `wsgi.py`
garante que o Gunicorn use automaticamente o valor fornecido, evitando telas em branco ou retornos do README
quando o servidor web padrão da plataforma assume o controle do domínio.

## Variáveis de ambiente

Configure as credenciais e segredos utilizados pelo aplicativo antes de executar em produção.

| Variável            | Descrição                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| `FLASK_SECRET_KEY`  | Valor usado para assinar os cookies de sessão do Flask.                   |
| `OPENAI_API_KEY`    | Chave da API Vision da OpenAI (necessária quando integrar o serviço real). |
| `GEMINI_API_KEY`    | Chave da API do modelo de geração de imagem (ex.: Gemini Nano-Banana).     |

Um arquivo `.env.example` está incluído como referência. Copie-o para `.env` durante o desenvolvimento local e preencha os valores apropriados.

## Implantação com GitHub Actions

O repositório inclui um workflow (`.github/workflows/deploy.yml`) que:

1. Executa uma checagem estática compilando os módulos Python;
2. Constrói uma imagem Docker de produção;
3. Publica a imagem no GitHub Container Registry (GHCR) com tags automáticas.

Para habilitar o fluxo:

1. Acesse **Settings → Secrets and variables → Actions** no GitHub.
2. Em **Secrets**, crie as entradas `FLASK_SECRET_KEY`, `OPENAI_API_KEY` e `GEMINI_API_KEY` com os valores corretos.
3. (Opcional) Adicione o mesmo trio em **Variables** caso deseje disponibilizá-los como variáveis de ambiente não sensíveis para jobs de QA.
4. Garanta que o GitHub Packages esteja habilitado para a organização/usuário do repositório.

Após cada push na branch `main`, o workflow enviará a imagem para `ghcr.io/<owner>/<repo>`. Use essa imagem como base para a plataforma de hospedagem de sua preferência (por exemplo, GitHub Environments, Azure Web Apps, Render, Fly.io etc.) fornecendo as variáveis de ambiente acima durante a execução do container.

## Estrutura de pastas

```
app/
├── app.py                # Rotas Flask e lógica principal
├── data/
│   ├── prompts.json      # Prompts editáveis persistidos em disco
│   └── state.json        # Últimos resultados processados
├── services/
│   ├── gemini.py         # Stub para geração de imagem (Gemini Nano-Banana)
│   └── vision.py         # Stub para análise de imagem (OpenAI Vision)
├── static/
│   ├── css/styles.css    # Estilos da interface
│   ├── enhanced/         # Saída gerada pelo modelo (salvo em runtime)
│   └── uploads/          # Imagens originais enviadas
└── templates/
    ├── backend.html      # Painel de edição de prompts e respostas
    ├── index.html        # Painel principal
    └── layout.html       # Layout base compartilhado
```

## Próximos passos sugeridos

1. Substituir os stubs pelas integrações reais com as APIs da OpenAI e do Gemini.
2. Adicionar autenticação simples ao painel de back-end.
3. Persistir os resultados em um banco de dados para histórico longitudinal dos pacientes.
