import React, { useState } from 'react';

// O componente principal da sua página de estoque
const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState('');

  // Função para adicionar um novo produto
  const handleAdicionarItem = () => {
    if (novoProduto.trim() !== '') {
      setProdutos([
        ...produtos,
        { id: Date.now(), nome: novoProduto, quantidade: 1 },
      ]);
      setNovoProduto(''); // Limpa o input após adicionar
    }
  };

  // Função para aumentar a quantidade
  const handleAumentarQuantidade = (id) => {
    setProdutos(produtos.map((produto) =>
      produto.id === id ? { ...produto, quantidade: produto.quantidade + 1 } : produto
    ));
  };

  // Função para diminuir a quantidade
  const handleDiminuirQuantidade = (id) => {
    setProdutos(produtos.map((produto) =>
      produto.id === id && produto.quantidade > 1 ? { ...produto, quantidade: produto.quantidade - 1 } : produto
    ));
  };

  // Função para remover um item
  const handleRemoverItem = (id) => {
    setProdutos(produtos.filter((produto) => produto.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sistema de Estoque
        </h1>

        {/* --- Seção de Adicionar Item --- */}
        <div className="flex space-x-2 mb-8">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do produto"
            value={novoProduto}
            onChange={(e) => setNovoProduto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdicionarItem()}
          />
          <button
            onClick={handleAdicionarItem}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Adicionar
          </button>
        </div>

        {/* --- Lista de Produtos --- */}
        <ul className="space-y-4">
          {produtos.map((produto) => (
            <li
              key={produto.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <span className="flex-1 text-lg font-medium text-gray-700">
                {produto.nome}
              </span>
              <div className="flex items-center space-x-2">
                {/* Botões para gerenciar a quantidade */}
                <button
                  onClick={() => handleDiminuirQuantidade(produto.id)}
                  className="px-3 py-1 text-xl font-bold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-gray-800 w-8 text-center">
                  {produto.quantidade}
                </span>
                <button
                  onClick={() => handleAumentarQuantidade(produto.id)}
                  className="px-3 py-1 text-xl font-bold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  +
                </button>
                
                {/* Botão para remover o item */}
                <button
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

        {produtos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Nenhum produto em estoque.</p>
        )}
      </div>
    </div>
  );
};

export default Estoque;