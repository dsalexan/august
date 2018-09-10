// recebe o nome de usuario e senha e tenta conectar com o proxy da unifep
module.exports.authenticateProxy = function(username, password, onSuccess, onError){
    // TODO: autenticar de verdade pelo proxy, e fazer isso async
    if(username == 'danilo.alexandre'){
        onSuccess({auth: false})
    }else{
        onSuccess({auth: true})
    }
}