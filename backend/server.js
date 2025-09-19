// IMPORTA O MÓDULO EXPRESS PARA CONSTRUIR A APLICAÇÃO
const express = require("express");
// PERMITE QUE ACESSE ROTAS DIFERENTES (DOMÍNIOS)
const cors =require("cors")
// MIDDLEWARE QUE ANALISA AS REQUISIÇÕES DO CORPO DA PÁGINA  COMO ENTRADA HTTP
const bodyParser = require("body-parser")
// FUNÇÃO RESPONSAVEL POR GERAR ID UNICOS
const {v4:uuid} = require("uuid");

// INSTANCIANDO O EXPRESS
const app = express();

// DEFINE A PORTA DO SERVIDOR
const port =5001;

// USANDO O CORS PARA HABILITAR AS ROTAS
app.use(cors());
//USANDO O BODY-PARSER PARA ANALISAR AS REQUISIÇÕES(EX. DADOS DE UM FORMULARIO) NA APLICAÇÃO E CONVERT PARA JSON
app.use(bodyParser.json());

// VARIAVEL QUE RECEBE UM ARRAY VAZIO
let produtos=[];


/************************************************************************
 *              CRIANDO A ROTA CADASTRAR PRODUTO (POST)                                            *
 ***********************************************************************/

app.post("/produto",(req,res)=>{
    // DESTRUCT -ACESSA PROPRIEDADES QUE SERÃO MANIPULADAS NO CORPO DA PÁGINA
    const {nome, descricao} = req.body;
    // VALIDAÇÃO DOS CAMPOS
    if(!nome || !descricao){
        return res.status(400).json({error:"Campos Inválidos"})
    }
    // REALIZA O NOVO CADASTRO COM ID, NOME E DESCRIÇÃO
    const novoItem = {id:uuid(), nome, descricao}
    // PEGA O PRODUTO CADASTRADO E ADICIONA NO ARRAY PRODUTOS
    produtos.push(novoItem)
    // RETORNA UMA MENSAGEM DE SUCESSO
    res.status(200).json(novoItem)

})

/************************************************************************
 *           ROTA PARA CONSULTAR TODOS OS PRODUTOS CADASTRADOS (GET)                                           *
 ***********************************************************************/

app.get("/produto", (req,res)=>{
    res.json(produtos)
})

/************************************************************************
 *          ROTA PARA ALTERAR PRODUTO CADASTRADO (PUT)                                           *
 ***********************************************************************/


app.put("/produto/:id", (req,res)=>{
    // OBTER O ID DO PRODUTO NA URL
    const produtoId = req.params.id;
    // DESTRUCT -ACESSA PROPRIEDADES QUE SERÃO MANIPULADAS NO CORPO DA PÁGINA
    const {nome, descricao} = req.body;
    // VALIDAÇÃO DOS CAMPOS
    if(!nome || !descricao){
        return res.status(400).json({error:"Campos Inválidos"})
    }
    // VERIFICA E VALIDA SE O PRODUTO FOI ALTERADO
    const produtoIndex = produtos.findIndex(item=>item.id === produtoId);
    if(produtoIndex === -1){
         res.status(400).json({error:"Produto não encontrado"})
    }
    // RECEBE OS DADOS COM A ALTERAÇÃO
    produtos[produtoIndex]={id:produtoId,nome, descricao}
    // RETORNA OS DADOS ALTERADOS NO ARRAY PRODUTOS
    res.json(produtos[produtoIndex])
 
})

/************************************************************************
 *          ROTA PARA DELETAR UM PRODUTO CADASTRADO (DELETE)                                         *
 ***********************************************************************/


app.delete("/produto/:id", (req,res)=>{
    // OBTER O ID DO PRODUTO NA URL
    const produtoId = req.params.id;
    // ARMAZENA O TAMANHO DO INICIO DO ARRAY DE PRODUTOS
    const inicioProduto = produtos.length;
    // FILTRA O ARRAY E REMOVE O PRODUTO COM O ID ESCOLHIDO
    produtos= produtos.filter(item=>item.id !== produtoId)
    // VERIFICA SE O PRODUTO FOI REMOVIDO
    if(produtos.length == inicioProduto){
        return res.status(404).json({error:"Produto não encontrado"})
    }
    // MENSAGEM AFIRMANDO QUE O PRODUTO FOI REMOVIDO
    res.status(201).send("Produto removido com sucesso")


})


/************************************************************************
 *          EXECUTANDO O SERVIDOR A NA PORTA DEFINIDA                                        *
 ***********************************************************************/

app.listen(port,()=>{
    console.log(`Servidor rodandos na porta http://localhost:${port}`)
})
