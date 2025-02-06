

export async function statusGenerator(existingPayload: any,sessionData: any){
    if(sessionData.order_id){
        existingPayload.message.order_id = sessionData.order_id
    }
    return existingPayload;
}