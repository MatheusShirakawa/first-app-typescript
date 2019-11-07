export function logarComoTempoDeExecucao(emSegundos: boolean = false){

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){

        const methodoOriginal = descriptor.value;

        descriptor.value = function(...args:any[]){
            let unidade = 'ms';
            let divisor = 1;
            if(emSegundos){
                unidade = 's';
                divisor = 1000;
            }
            console.log('-------------');
            console.log(`parametros passados para o metodo ${propertyKey}: ${JSON.stringify(args)}`);
            const t1 = performance.now();
            const retorno = methodoOriginal.apply(this, args);
            const t2 = performance.now();
            console.log(`o retorno do método ${propertyKey} é ${JSON.stringify(retorno)}`);
            console.log(`o método ${propertyKey} demorou ${(t2 - t1) / divisor} ${unidade}`);
            return retorno;
        }

        return descriptor;

    }
}