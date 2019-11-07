export function throttle(milissegundos = 500){

    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor){

        const methodoOriginal = descriptor.value;
        let timer = 0;
        descriptor.value = function(...args:any[]){           

            if(event) event.preventDefault();
            clearInterval(timer);
            timer = setTimeout(() => methodoOriginal.apply(this, args),milissegundos);
        }

        return descriptor;

    }
}