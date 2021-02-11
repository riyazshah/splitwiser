import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Layout from '../components/layout'
import {getSqsMessage, deleteSqsMessage} from '../util/sqs-util'
import addExpense from '../util/splitwise-util'
import { TransactionBuilder } from '../model/transaction'
const parseJson = require('parse-json');

function ExecuteTransactions({ transactionFromJson, messageHandle }) {
    if (transactionFromJson && messageHandle) {
        return ( 
            <Layout>
                <div>
                    <h3>Execute Transactions</h3> 
                    <form action="/executeTransactions" method="GET" className="transactionForm">
                        <h4> Transaction: </h4> 
                        <Form.Group controlid="transactionGroup" className="transactionGroupClass">
                            <Form.Label htmlFor="transactionDate">Transaction Date:  </Form.Label>
                            <Form.Control type="text" id="transactionDate" name="transactionDate" defaultValue={transactionFromJson.date}/>
                            <Form.Label htmlFor="transactionYear">Tranaction Year:  </Form.Label>
                            <Form.Control type="test" id="transactionYear" name="transactionYear" defaultValue="2020"/>
                            <Form.Label htmlFor="transactionVendor">Vendor:  </Form.Label>
                            <Form.Control type="text" id="transactionVendor" name="transactionVendor" defaultValue={transactionFromJson.vendor}/>
                            <Form.Label htmlFor="transactionAmount">Amount:  </Form.Label>
                            <Form.Control type="text" id="transactionAmount" name="transactionAmount" defaultValue={transactionFromJson.amount}/><br/>
                        </Form.Group>
                        <h4> Split Type </h4>

                        <Form.Group controlid="SplitGroup" className="splitGroupClass">
                            <Form.Check inline type="radio" id="percent" name="splitType" value="percent" defaultChecked={true} label="Percent"/>
                            <Form.Check inline type="radio" id="absolute" name="splitType" value="absolute" label="Absolute"/><br/>
                            <div className="paySplit">
                                <div className="userPay">
                                    <Form.Label className="userPayLabel" htmlFor="xp">Xio Pays: </Form.Label>
                                    <Form.Control className="userPayValue" type="text" id="xp" name="xp" defaultValue="50"/><br/>
                                </div>
                                <div className="userPay secondUserPay">
                                    <Form.Label className="userPayLabel" htmlFor="rp">Riyaz Pays: </Form.Label>
                                    <Form.Control className="userPayValue" type="text" id="rp" name="rp" defaultValue="50"/><br/>
                                </div>
                            </div>
                            <Form.Control type="hidden" name="receiptHandle" id="receiptHandle" value={messageHandle} />
                            <Button variant="primary" type="success" value="Submit">Submit</Button>                
                        </Form.Group>
                    </form>
                    <form action="/executeTransactions" method="GET" className="transactionForm">
                        <Form.Control type="hidden" name="skip" id="skip" value="true" />
                        <Form.Control type="hidden" name="receiptHandle" id="receiptHandle" value={messageHandle} />
                        <Button variant="danger" type="submit" value="Skip">Skip</Button>
                    </form>
                </div>
            </Layout>
        )
    } else {
        return(
            <Layout>
                <div>
                    <h3>Execute Transactions</h3> 
                    No more transactions! 
                    <br/>
                    If you just uploaded your file or if you feel like there should be more transactions, please wait a minute and then click <a href="/executeTransactions"> here </a> to refresh. 
                    <br/> <br/>
                    If you'd like to upload a new file, click <a href="/uploadFile">here.</a>
                </div>
            </Layout>
        )
    }
}

export async function getServerSideProps({query}) {
    //TODO: Consider splitting out execute and skip to separate handlers
    if ("transactionDate" in query) {
        const transaction = constructTransactionFromQuery(query)
        await addExpense(transaction)
        await deleteSqsMessage(query.receiptHandle)
    } else if ("skip" in query) {
        await deleteSqsMessage(query.receiptHandle)
    }
    var message = await getSqsMessage()
    if (message) {
        var transactionFromJson = parseJson(message.Body)
        var messageHandle = message.ReceiptHandle
        return { props: { transactionFromJson, messageHandle } }
    }
    return {props: { transactionFromJson: null , messageHandle: null }}
}

//TODO: Move to util
function constructTransactionFromQuery(query) {
    const date = query.transactionDate;
    const year = query.transactionYear;
    const fullDate = date + "/" + year;
    console.log(new Date(fullDate))
    const vendor = query.transactionVendor;
    const amount = query.transactionAmount;
    const isAbsolute = query.splitType === "absolute";
    const riyazPays = query.rp;
    const xioPays = query.xp;
    return new TransactionBuilder()
                .withDescription(vendor)
                .withDate(fullDate)
                .withTotalAmount(amount)
                .withIsAbsoluteAmounts(isAbsolute)
                .withRiyazPays(riyazPays)
                .withXioPays(xioPays)
                .build();
}

export default ExecuteTransactions