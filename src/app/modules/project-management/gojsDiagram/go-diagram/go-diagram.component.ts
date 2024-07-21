import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';

const $ = go.GraphObject.make;

@Component({
  selector: 'app-go-diagram',
  templateUrl: './go-diagram.component.html',
  styleUrls: ['./go-diagram.component.scss']
})
export class GoDiagramComponent {
  // public diagram: go.Diagram | any = null;
  public diagram: go.Diagram = new go.Diagram();

  @Input()
  get model(): go.Model { return this.diagram!.model; }
  set model(val: go.Model) { this.diagram.model = val; }

  @Output()
  nodeSelected = new EventEmitter<go.Node|null>();

  // @Output()
  // modelChanged = new EventEmitter<go.ChangedEvent>();



  @Output()
  public nodeClicked = new EventEmitter();

  constructor() {

  }

  public ngAfterViewInit() {
    this.diagram = $(go.Diagram, 'myDiagramDiv',
      {
        layout:
          // $(go.TreeLayout,
          //   {
          //     isOngoing: false,
          //     treeStyle: go.TreeLayout.StyleLastParents,
          //     arrangement: go.TreeLayout.ArrangementHorizontal,
          //     // properties for most of the tree:
          //     angle: 90,
          //     layerSpacing: 35,
          //     // properties for the "last parents":
          //     alternateAngle: 90,
          //     alternateLayerSpacing: 35,
          //     alternateAlignment: go.TreeLayout.AlignmentBus,
          //     alternateNodeSpacing: 20
          //   }),
            $(go.GridLayout,
              {
                sorting: go.GridLayout.Ascending,
                comparer: (pa: { data: any; }, pb: { data: any; }) => {
                  var da = pa.data;
                  var db = pb.data;
                  if (da.someProperty < db.someProperty) return -1;
                  if (da.someProperty > db.someProperty) return 1;
                  return 0;
                }
              }
            ),
            // $(go.TreeLayout, { isInitial: true, isOngoing: false  }),
        'undoManager.isEnabled': true
      }
    );

    // define the Node template
    this.diagram.nodeTemplate =
      $(go.Node, 'Auto', { deletable: false },
        // new go.Binding("location", "loc"),
        //new go.Binding("location", "loc", go.Point.parse),

        // new go.Binding("location", "loc").makeTwoWay(),
        // for sorting, have the Node.text be the data.name
        new go.Binding('text', 'name'),
        new go.Binding('text', 'namee'),
        // bind the Part.layerName to control the Node's layer depending on whether it isSelected
        new go.Binding('layerName', 'isSelected', function(sel) { return sel ? 'Foreground' : ''; }).ofObject(),
        // define the node's outer shape
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', stroke: null,
            portId: "",  // this Shape is the Node's port, not the whole Node
            fromLinkable: true, fromLinkableSelfNode: false, fromLinkableDuplicates: false,
            toLinkable: true, toLinkableSelfNode: false, toLinkableDuplicates: false,cursor: 'pointer'
          },new go.Binding("fill", "colorfill"),
          // new go.Binding('fill', 'colorfill').ofObject()
        ),
        $(go.Panel, 'Horizontal',

          // define the panel where the text will appear
          $(go.Panel, 'Table',
            {
              margin: new go.Margin(6, 10, 0, 3),
              // defaultAlignment: go.Spot.Center
            },
            $(go.RowColumnDefinition, { column: 3, width: 6 }),
            $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },  // the name
              {
                row: 0, column: 0, columnSpan: 5,
                font: '12pt Segoe UI,sans-serif',
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding('text', 'name').makeTwoWay()),
              $(go.TextBlock, { font: '8pt  Segoe UI,sans-serif', stroke: 'black' },  // the namee
              {
                row: 1, column: 0, columnSpan: 5,
                font: '8pt Bold Segoe UI,sans-serif',
                editable: true, isMultiline: false,
                minSize: new go.Size(10, 16)
              },
              new go.Binding('text', 'namee').makeTwoWay()),

              // $(go.TextBlock, { margin: 5 },
              // new go.Binding('text', 'loc').makeTwoWay()),
              // $(go.TextBlock,
              //   { position: new go.Point(6, 6), font: "8pt sans-serif" },
              //   new go.Binding("text", "loc")),
              {
                toolTip:
                    $("ToolTip",
                        $(go.TextBlock, { font: '13pt  Segoe UI,sans-serif', stroke: 'black' ,margin: 5 },
                        new go.Binding("text", "toolTipName"))
                    )
              },

            $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },  // the comments
              {
                row: 3, column: 0, columnSpan: 5,
                font: '9pt  Segoe UI,sans-serif',
                wrap: go.TextBlock.WrapFit,
                editable: true,  // by default newlines are allowed
                minSize: new go.Size(10, 14)
              },
              new go.Binding('text', 'comments').makeTwoWay())
          )  // end Table Panel
        ) // end Horizontal Panel
      );  // end Node
      this.diagram.groupTemplate =
      $(go.Group, "Vertical", { deletable: false },
        $(go.Panel, "Auto",
          $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
            { parameter1: 14,
              fill: "rgba(128,128,128,0.33)" }, new go.Binding("fill", "colorfill")),
          $(go.Placeholder,    // represents the area of all member parts,
            { padding: 3})  // with some extra padding around them
        ),
        $(go.TextBlock,         // group title
          { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
          new go.Binding("text", "name"))

      );
    this.diagram.model = this.model;

    // when the selection changes, emit event to app-component updating the selected node
    this.diagram.addDiagramListener('ChangedSelection', (e: any) => {
      const node = this.diagram.selection.first();
      this.nodeClicked.emit(node);
    });
  }

}
