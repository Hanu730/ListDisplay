import * as React from 'react';
import styles from './ListForms.module.scss';
import type { IListFormsProps } from './IListFormsProps';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
//import { escape } from '@microsoft/sp-lodash-subset';
interface ListState {
  item: any;
  isLoading: boolean;
  error: string | null;
}
export default class ListForms extends React.Component<IListFormsProps,ListState> {
  constructor(props:IListFormsProps){
    super(props)
    this.state = {
      item: null,
      isLoading: true,
      error: null,
    };
  }
  public render(): React.ReactElement<IListFormsProps> {
  
    const { item,isLoading,error} = this.state;
    console.log(this.state);
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }
    return (
      <div className={styles['sp-display-form']}>
      <h2>Announcements</h2>
      <div className={styles["sp-form-section"]}>
        <label className={styles["sp-form-label"]}>Title:</label>
        <div className={styles["sp-form-value"]}>{item.Title}</div>
      </div>
      <div className={styles["sp-form-section"]}>
        <label className={styles["sp-form-label"]}>Body:</label>
        <div className={styles["sp-form-value"]} dangerouslySetInnerHTML={{ __html: item.Body }} />
      </div>

      <div className={styles["sp-form-section"]}>
        <label className={styles["sp-form-label"]}>Description:</label>
        <div className={styles["sp-form-value"]}>{item.Description}</div>
      </div>

      <div className={styles["sp-form-section"]}>
        <label className={styles["sp-form-label"]}>Expires:</label>
        <div className={styles["sp-form-value"]}>{item.Expires ? new Date(item.Expires).toLocaleDateString() : 'N/A'}</div>
      </div>

      {item.ImageUrl && (
        <div className={styles["sp-form-section"]}>
          <label className={styles["sp-form-label"]}>Image:</label>
          <img src={item.ImageUrl.Url} alt="Item Image" className={styles["sp-form-image"]} />
        </div>
      )}
    </div>
    );
  }
  componentDidMount() {
    sp.setup({
      spfxContext:this.context,
      sp: {
         baseUrl: "https://websyn.sharepoint.com/sites/Websyn-Intranet-UAT", // Replace with your site URL
      },
    })
    const urlParams = new URLSearchParams(window.location.search);
    
    const itemId = urlParams.get('itemId');
    console.log(itemId);  // Get the ID from the query string
    
    if (itemId) {
      console.log(itemId)
      // Fetch the list item using PnPjs
      sp.web.lists.getByTitle('Latest Announcements')  // Replace with your list name
        .items.getById(Number(itemId))  // Use the ID as a number
        .get()
        .then((item) => {
          this.setState({
            item: item,
            isLoading: false,
          });
          
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error: error.message,
          });
        });
    } else {
      this.setState({
        isLoading: false,
        error: 'Item ID is missing from the query string',
      });
    }
  }
}
