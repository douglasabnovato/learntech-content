/* openapi.ts — gera o documento OpenAPI 3.1 da API a partir dos schemas zod, para /v1/openapi.json. */
import { z } from "zod";
import { programaSchema, questaoSchema, areaSchema } from "../../src/schemas/learn-tech";
import { eventoSchema } from "../../src/schemas/bootcamps";
import { empresaSchema, vagaOuPerfilSchema, ferramentaSchema, destaquesSchema, modeloCurriculoSchema } from "../../src/schemas/career-tools";
import { coberturaSchema } from "../../src/schemas/cobertura";
import { entradaAcessoSchema } from "../../src/acessos/schema";
import { entradaMensagemSchema, motivos } from "../../src/mensagens/schema";

/* Converte um schema zod em JSON Schema sem quebrar o build quando há refinamentos. */
function js(schema: z.ZodType): Record<string, unknown> {
  return z.toJSONSchema(schema, { unrepresentable: "any", io: "input" }) as Record<string, unknown>;
}

/* Resposta JSON de leitura com referência a um componente. */
function leitura(descricao: string, ref: string, lista = false) {
  const schema = lista ? { type: "array", items: { $ref: `#/components/schemas/${ref}` } } : { $ref: `#/components/schemas/${ref}` };
  return { get: { summary: descricao, responses: { "200": { description: "OK", content: { "application/json": { schema } } } } } };
}

/* Monta o documento completo. */
export function gerarOpenApi(versao: string): Record<string, unknown> {
  const admin = [{ bearer: [] }];
  return {
    openapi: "3.1.0",
    info: {
      title: "LearnTECH Content API",
      version: versao,
      description: "Conteúdo aberto e gratuito do ecossistema LearnTECH (learn-tech, bootcamps, career e tools). Leitura pública e sem autenticação; as únicas escritas são o registro de acesso e a mensagem do formulário \"Fala aê\".",
      license: { name: "Conteúdo de uso educacional e gratuito" },
    },
    servers: [{ url: "/" }],
    paths: {
      "/v1/index.json": { get: { summary: "Índice dos recursos publicados", responses: { "200": { description: "OK" } } } },
      "/v1/learn-tech/programas.json": leitura("Catálogo de programas (resumo)", "Programa", true),
      "/v1/learn-tech/programas/{id}.json": { ...leitura("Programa completo", "Programa"), parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }] },
      "/v1/learn-tech/areas.json": leitura("Áreas de atuação em tecnologia", "Area", true),
      "/v1/learn-tech/paginas/{nome}.json": { get: { summary: "Conteúdo de página do learn-tech", parameters: [{ name: "nome", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } } },
      "/v1/bootcamps/eventos.json": leitura("Eventos", "Evento", true),
      "/v1/bootcamps/eventos/{slug}.json": { ...leitura("Evento", "Evento"), parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }] },
      "/v1/career/empresas.json": leitura("Empresas", "Empresa", true),
      "/v1/career/vagas.json": leitura("Plataformas de vagas", "VagaOuPerfil", true),
      "/v1/career/perfis.json": leitura("Perfis de devs", "VagaOuPerfil", true),
      "/v1/career/destaques.json": leitura("Destaques do carrossel", "Destaques"),
      "/v1/career/modelos-curriculo.json": leitura("Modelos de currículo fictícios", "ModeloCurriculo", true),
      "/v1/tools/ferramentas.json": leitura("Ferramentas", "Ferramenta", true),
      "/v1/tools/hospedagens.json": leitura("Hospedagens", "Ferramenta", true),
      "/v1/cobertura.json": leitura("Matriz de cobertura do acervo", "Cobertura"),
      "/v1/saude": { get: { summary: "Verificação de funcionamento", responses: { "200": { description: "OK" } } } },
      "/v1/acessos": {
        post: {
          summary: "Registra um acesso (nome completo, e-mail, projeto e página)",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EntradaAcesso" } } } },
          responses: {
            "201": { description: "Registrado" },
            "200": { description: "Já registrado nos últimos minutos (sem nova linha)" },
            "400": { description: "Dados inválidos" },
            "403": { description: "Origem não permitida ou verificação anti-robô falhou" },
          },
        },
        get: {
          summary: "Lista acessos (administração)", security: admin,
          parameters: [
            { name: "projeto", in: "query", schema: { type: "string" } },
            { name: "desde", in: "query", schema: { type: "string", format: "date" } },
            { name: "limite", in: "query", schema: { type: "integer", maximum: 1000 } },
            { name: "formato", in: "query", schema: { type: "string", enum: ["json", "csv"] } },
          ],
          responses: { "200": { description: "OK" }, "401": { description: "Token ausente ou inválido" } },
        },
        delete: {
          summary: "Apaga todos os acessos e mensagens de um e-mail (pedido do titular, LGPD)", security: admin,
          parameters: [{ name: "email", in: "query", required: true, schema: { type: "string", format: "email" } }],
          responses: { "200": { description: "Quantidade apagada: { apagados (acessos), mensagens }" }, "401": { description: "Token ausente ou inválido" } },
        },
      },
      "/v1/mensagens": {
        post: {
          summary: "Envia uma mensagem do formulário \"Fala aê\" (motivo, mensagem, nome completo, e-mail, projeto e página)",
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EntradaMensagem" } } } },
          responses: {
            "201": { description: "Recebida: { registrado: true, id }" },
            "200": { description: "Mensagem idêntica do mesmo e-mail já recebida nos últimos 10 minutos (sem nova linha)" },
            "400": { description: "Dados inválidos: { erro, campos: [{ campo, mensagem }] }" },
            "403": { description: "Origem não permitida ou verificação anti-robô falhou" },
            "413": { description: "Corpo maior que 24 KiB" },
          },
        },
        get: {
          summary: "Lista mensagens (administração)", security: admin,
          parameters: [
            { name: "projeto", in: "query", schema: { type: "string" } },
            { name: "motivo", in: "query", schema: { type: "string", enum: [...motivos] } },
            { name: "email", in: "query", schema: { type: "string", format: "email" } },
            { name: "desde", in: "query", schema: { type: "string", format: "date" } },
            { name: "limite", in: "query", schema: { type: "integer", maximum: 1000 } },
            { name: "formato", in: "query", schema: { type: "string", enum: ["json", "csv"] } },
          ],
          responses: { "200": { description: "OK" }, "401": { description: "Token ausente ou inválido" } },
        },
        delete: {
          summary: "Apaga todas as mensagens de um e-mail (pedido do titular, LGPD)", security: admin,
          parameters: [{ name: "email", in: "query", required: true, schema: { type: "string", format: "email" } }],
          responses: { "200": { description: "Quantidade apagada: { apagadas }" }, "401": { description: "Token ausente ou inválido" } },
        },
      },
      "/v1/acessos/resumo": { get: { summary: "Totais por projeto e por dia (administração)", security: admin, responses: { "200": { description: "OK" } } } },
    },
    components: {
      securitySchemes: { bearer: { type: "http", scheme: "bearer" } },
      schemas: {
        Programa: js(programaSchema),
        Questao: js(questaoSchema),
        Area: js(areaSchema),
        Evento: js(eventoSchema),
        Empresa: js(empresaSchema),
        VagaOuPerfil: js(vagaOuPerfilSchema),
        Destaques: js(destaquesSchema),
        ModeloCurriculo: js(modeloCurriculoSchema),
        Ferramenta: js(ferramentaSchema),
        Cobertura: js(coberturaSchema),
        EntradaAcesso: js(entradaAcessoSchema),
        EntradaMensagem: js(entradaMensagemSchema),
      },
    },
  };
}

/* Fim de openapi.ts */
