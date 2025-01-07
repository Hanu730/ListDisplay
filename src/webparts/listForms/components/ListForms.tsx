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
      return <div>Error {error}</div>;
    }
    return (
      <div className={styles.webPartContainer}>
      <div className={styles.header}>
        {item.Title}
      </div>
      <div className={styles.imageContainer}>
        <img
          src={item.ImageUrl.Url} // Replace with the actual image URL
          alt="Welcome"
          
        />
     </div>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: item.Body }}>
        {/* <p>
          We are excited to announce the launch of our new employee intranet portal built on SharePoint! This portal will be your go-to place for all company-related news, resources, tools, and information. Whether you're looking for HR documents, team collaboration spaces, or the latest company updates, everything is now available in one convenient place.
        </p> */}
      </div>
     
    </div>
    //   <div className={styles['sp-display-form']}>
    //   <h2 className={styles.header1} >{item.Title}</h2>
    //   <div className={styles["sp-form-section"]}>
    //     <label className={styles["sp-form-label"]}>Body:</label>
    //     <div className={styles["sp-form-value"]} dangerouslySetInnerHTML={{ __html: item.Body }} />
    //   </div>

    //   <div className={styles["sp-form-section"]}>
    //     <label className={styles["sp-form-label"]}>Description:</label>
    //     <div className={styles["sp-form-value"]}>{item.Description}</div>
    //   </div>

    //   <div className={styles["sp-form-section"]}>
    //     <label className={styles["sp-form-label"]}>Expires:</label>
    //     <div className={styles["sp-form-value"]}>{item.Expires ? new Date(item.Expires).toLocaleDateString() : 'N/A'}</div>
    //   </div>

    //   {item.ImageUrl && (
    //     <div className={styles["sp-form-section"]}>
    //       <label className={styles["sp-form-label"]}>Image:</label>
    //       <img src={item.ImageUrl.Url} alt="Item Image" className={styles["sp-form-image"]} />
    //     </div>
    //   )}
    // </div>
    );
  }
  componentDidMount() {
    sp.setup({
      spfxContext:this.context,
      sp: {
         baseUrl: this.props.context.pageContext.web.absoluteUrl, // Replace with your site URL
      },
    })
    const urlParams = new URLSearchParams(window.location.search);
  
    
    const itemId = urlParams.get('itemId');
    const listName = urlParams.get('list');
    console.log(itemId);  // Get the ID from the query string
    
    if (itemId) {
      console.log(itemId)
      // Fetch the list item using PnPjs
      sp.web.lists.getByTitle(listName+"")  // Replace with your list name
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
