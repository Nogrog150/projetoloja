// src/Estoque.jsx
import React, { useState } from 'react';

// O componente principal da sua página de estoque.
// O 'Estoque' é um componente de função que gerencia o estado da aplicação.
const Estoque = () => {
  // 1. Hook de Estado para a lista de produtos.
  // 'produtos' guarda a lista atual de produtos.
  // 'setProdutos' é a função que usamos para atualizar essa lista.
  // Começamos com um array vazio [].
  const [produtos, setProdutos] = useState([]);
  
  // 2. Hook de Estado para o input de novo produto.
  // 'novoProduto' guarda o texto digitado no input.
  // 'setNovoProduto' atualiza o valor desse texto.
  // Começamos com uma string vazia ''.
  const [novoProduto, setNovoProduto] = useState('');

  // 3. Função para adicionar um novo produto.
  // Esta função é chamada quando o botão "Adicionar" é clicado.
  const handleAdicionarItem = () => {
    // Verifica se o input não está vazio (após remover espaços em branco).
    if (novoProduto.trim() !== '') {
      // Cria uma nova lista de produtos, copiando a lista antiga (...produtos)
      // e adicionando um novo objeto no final.
      // O 'id' é criado com Date.now() para ser único.
      // A 'quantidade' inicial é sempre 1.
      setProdutos([
        ...produtos,
        { id: Date.now(), nome: novoProduto, quantidade: 1 },
      ]);
      // Limpa o input, resetando a variável de estado 'novoProduto' para ''.
      setNovoProduto('');
    }
  };

  // 4. Função para aumentar a quantidade de um produto.
  // Recebe o 'id' do produto que será alterado.
  const handleAumentarQuantidade = (id) => {
    // Atualiza o estado 'produtos' com uma nova lista.
    // Usamos o método '.map()' para percorrer cada item da lista.
    setProdutos(produtos.map((produto) =>
      // Se o 'id' do produto atual for igual ao 'id' que passamos,
      // criamos um novo objeto com os dados antigos (...produto)
      // e apenas mudamos a 'quantidade'.
      // Se não for o mesmo 'id', retornamos o produto original sem alterações.
      produto.id === id ? { ...produto, quantidade: produto.quantidade + 1 } : produto
    ));
  };

  // 5. Função para diminuir a quantidade de um produto.
  // Recebe o 'id' do produto que será alterado.
  const handleDiminuirQuantidade = (id) => {
    // Usa o '.map()' para percorrer a lista.
    setProdutos(produtos.map((produto) =>
      // Condição: o 'id' deve ser o mesmo E a 'quantidade' deve ser maior que 1.
      // Se a condição for verdadeira, diminui a quantidade.
      // Caso contrário, retorna o produto sem alterações.
      produto.id === id && produto.quantidade > 1 ? { ...produto, quantidade: produto.quantidade - 1 } : produto
    ));
  };

  // 6. Função para remover um produto.
  // Recebe o 'id' do produto que será removido.
  const handleRemoverItem = (id) => {
    // Usa o método '.filter()' para criar uma nova lista.
    // O '.filter()' retorna apenas os itens que a condição for verdadeira.
    // Nesse caso, ele retorna todos os produtos que NÃO têm o 'id' que queremos remover.
    setProdutos(produtos.filter((produto) => produto.id !== id));
  };

  // 7. Retorno do componente (o que será renderizado na tela).
  // O código JSX abaixo é a parte visual do componente, com classes do Tailwind CSS para estilização.
  return (
    // Container principal: altura mínima da tela, cor de fundo cinza e padding.
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Container central: largura máxima, centralizado, fundo branco, sombra e cantos arredondados. */}
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg p-6">
        {/* Título da página. */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sistema de Estoque
        </h1>

        {/* --- Seção de Adicionar Item --- */}
        {/* Contêiner do input e do botão "Adicionar". */}
        <div className="flex space-x-2 mb-8">
          {/* Input para digitar o nome do produto. */}
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do produto"
            // O 'value' do input é controlado pelo estado 'novoProduto'.
            value={novoProduto}
            // 'onChange' atualiza o estado 'novoProduto' a cada letra digitada.
            onChange={(e) => setNovoProduto(e.target.value)}
            // 'onKeyDown' permite adicionar um item ao pressionar 'Enter'.
            onKeyDown={(e) => e.key === 'Enter' && handleAdicionarItem()}
          />
          {/* Botão para adicionar o produto. */}
          <button
            // 'onClick' chama a função para adicionar o item.
            onClick={handleAdicionarItem}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Adicionar
          </button>
        </div>

        {/* --- Lista de Produtos --- */}
        {/* Lista não ordenada que vai conter os produtos. */}
        <ul className="space-y-4">
          {/* O '.map()' percorre a lista 'produtos' e renderiza um '<li>' para cada item. */}
          {produtos.map((produto) => (
            // Cada item da lista. A 'key' é obrigatória no React para otimização.
            <li
              key={produto.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              {/* Nome do produto. */}
              <span className="flex-1 text-lg font-medium text-gray-700">
                {produto.nome}
              </span>
              {/* Botões e quantidade. */}
              <div className="flex items-center space-x-2">
                {/* Botão para diminuir a quantidade. */}
                <button
                  // 'onClick' chama a função de diminuir, passando o 'id' do produto.
                  onClick={() => handleDiminuirQuantidade(produto.id)}
                  className="px-3 py-1 text-xl font-bold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  -
                </button>
                {/* Exibe a quantidade atual. */}
                <span className="text-xl font-semibold text-gray-800 w-8 text-center">
                  {produto.quantidade}
                </span>
                {/* Botão para aumentar a quantidade. */}
                <button
                  // 'onClick' chama a função de aumentar, passando o 'id'.
                  onClick={() => handleAumentarQuantidade(produto.id)}
                  className="px-3 py-1 text-xl font-bold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  +
                </button>
                
                {/* Botão para remover o item, com ícone SVG de lixeira. */}
                <button
                  // 'onClick' chama a função de remover, passando o 'id'.
                  onClick={() => handleRemoverItem(produto.id)}
                  className="ml-4 p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Mensagem exibida se a lista de produtos estiver vazia. */}
        {produtos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Nenhum produto em estoque.</p>
        )}
      </div>
    </div>
  );
};

export default Estoque;