const CartaFrete = async (item,sel_cartaFrete) => {
    return {
        id: item.id,
        origem: item.origem,
        dados: {
            cartaFrete: sel_cartaFrete.cartaFrete,
            empresa: sel_cartaFrete.empresa,
            codigo: sel_cartaFrete.codigo,
            data: sel_cartaFrete.data,
            motorista: sel_cartaFrete.motorista,
            observacao: item.dados.observacao || sel_cartaFrete.trecho,
            operacao: item.dados.operacao,
            placas: sel_cartaFrete.placas,
            tipoVeiculo: item.dados.tipoVeiculo,
        },
        imagem: item.imagem,
        send: {
            date: null,
            message: "",
            success: false,
        },
    }
}
  export default CartaFrete